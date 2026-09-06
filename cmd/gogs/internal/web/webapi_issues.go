package web

import (
	"net/http"
	"slices"
	"strconv"
	"strings"

	"github.com/cockroachdb/errors"
	"gogs.io/gogs/internal/database"
	log "unknwon.dev/clog/v2"
)

type dashboardIssue struct {
	ID          int64  `json:"id"`
	Index       int64  `json:"index"`
	Poster      string `json:"poster"`
	PosterAvatar string `json:"posterAvatar"`
	Title       string `json:"title"`
	RepoID      int64  `json:"repoId"`
	RepoName    string `json:"repoName"`
	RepoFullName string `json:"repoFullName"`
	IsClosed    bool   `json:"isClosed"`
	CreatedUnix int64  `json:"createdUnix"`
	UpdatedUnix int64  `json:"updatedUnix"`
	NumComments int    `json:"numComments"`
}

type getIssuesResponse struct {
	Issues     []dashboardIssue `json:"issues"`
	Repos      []dashboardRepo  `json:"repos"`
	IssueStats *database.IssueStats `json:"issueStats"`
	Total      int              `json:"total"`
	Page       int              `json:"page"`
}

func getIssues(r *http.Request, u *database.User) (statusCode int, resp *getIssuesResponse, err error) {
	if u == nil {
		return http.StatusUnauthorized, nil, nil
	}


	isPullList := strings.Contains(r.URL.Path, "pulls")

	sortType := r.URL.Query().Get("sort")
	viewType := r.URL.Query().Get("type")
	types := []string{
		string(database.FilterModeYourRepos),
		string(database.FilterModeAssign),
		string(database.FilterModeCreate),
	}
	if !slices.Contains(types, viewType) {
		viewType = string(database.FilterModeYourRepos)
	}
	filterMode := database.FilterMode(viewType)

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page <= 0 {
		page = 1
	}

	repoID, _ := strconv.ParseInt(r.URL.Query().Get("repo"), 10, 64)
	isShowClosed := r.URL.Query().Get("state") == "closed"

	var (
		repos       []*database.Repository
		userRepoIDs []int64
		showRepos   = make([]*database.Repository, 0, 10)
	)

	repos, err = database.GetUserRepositories(
		&database.UserRepoOptions{
			UserID:   u.ID,
			Private:  true,
			Page:     1,
			PageSize: u.NumRepos,
		},
	)
	if err != nil {
		log.Error("getIssues: get user repos: %v", err)
		return http.StatusInternalServerError, nil, errors.Wrap(err, "get user repos")
	}

	userRepoIDs = make([]int64, 0, len(repos))
	for _, repo := range repos {
		userRepoIDs = append(userRepoIDs, repo.ID)
		if filterMode != database.FilterModeYourRepos {
			continue
		}
		if isPullList {
			if isShowClosed && repo.NumClosedPulls == 0 ||
				!isShowClosed && repo.NumOpenPulls == 0 {
				continue
			}
		} else {
			if !repo.EnableIssues || repo.EnableExternalTracker ||
				isShowClosed && repo.NumClosedIssues == 0 ||
				!isShowClosed && repo.NumOpenIssues == 0 {
				continue
			}
		}
		showRepos = append(showRepos, repo)
	}

	if !isPullList {
		userRepoIDs, err = database.FilterRepositoryWithIssues(userRepoIDs)
		if err != nil {
			log.Error("getIssues: filter repos: %v", err)
			return http.StatusInternalServerError, nil, errors.Wrap(err, "filter repos")
		}
	}

	issueOptions := &database.IssuesOptions{
		RepoID:   repoID,
		Page:     page,
		IsClosed: isShowClosed,
		IsPull:   isPullList,
		SortType: sortType,
	}

	switch filterMode {
	case database.FilterModeYourRepos:
		if userRepoIDs == nil || len(userRepoIDs) == 0 {
			issueOptions.RepoIDs = []int64{-1}
		} else {
			issueOptions.RepoIDs = userRepoIDs
		}
	case database.FilterModeAssign:
		issueOptions.AssigneeID = u.ID
	case database.FilterModeCreate:
		issueOptions.PosterID = u.ID
	}

	dbIssues, err := database.Issues(issueOptions)
	if err != nil {
		log.Error("getIssues: get issues: %v", err)
		return http.StatusInternalServerError, nil, errors.Wrap(err, "get issues")
	}

	// We need to load repo info for these issues
	for _, issue := range dbIssues {
		if err = issue.Repo.GetOwner(); err != nil {
			log.Error("getIssues: get owner: %v", err)
			return http.StatusInternalServerError, nil, errors.Wrap(err, "get owner")
		}
	}

	issueStats := database.GetUserIssueStats(repoID, u.ID, userRepoIDs, filterMode, isPullList)

	var total int
	if !isShowClosed {
		total = int(issueStats.OpenCount)
	} else {
		total = int(issueStats.ClosedCount)
	}

	issues := make([]dashboardIssue, 0, len(dbIssues))
	for _, issue := range dbIssues {
		issues = append(issues, dashboardIssue{
			ID:          issue.ID,
			Index:       issue.Index,
			Poster:      issue.Poster.Name,
			PosterAvatar: issue.Poster.AvatarURLPath(),
			Title:       issue.Title,
			RepoID:      issue.RepoID,
			RepoName:    issue.Repo.Name,
			RepoFullName: issue.Repo.FullName(),
			IsClosed:    issue.IsClosed,
			CreatedUnix: issue.CreatedUnix,
			UpdatedUnix: issue.UpdatedUnix,
			NumComments: issue.NumComments,
		})
	}

	outRepos := make([]dashboardRepo, 0, len(showRepos))
	for _, repo := range showRepos {
		if err = repo.GetOwner(); err != nil {
			continue
		}
		outRepos = append(outRepos, dashboardRepo{
			ID:        repo.ID,
			OwnerName: repo.Owner.Name,
			Name:      repo.Name,
			FullName:  repo.FullName(),
			NumStars:  repo.NumStars,
			IsFork:    repo.IsFork,
			IsPrivate: repo.IsPrivate,
			IsMirror:  repo.IsMirror,
		})
	}

	return http.StatusOK, &getIssuesResponse{
		Issues:     issues,
		Repos:      outRepos,
		IssueStats: issueStats,
		Total:      total,
		Page:       page,
	}, nil
}
