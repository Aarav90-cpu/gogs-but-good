package web

import (
	"net/http"

	"github.com/cockroachdb/errors"
	"gogs.io/gogs/internal/conf"
	"gogs.io/gogs/internal/database"
	log "unknwon.dev/clog/v2"
)

type dashboardFeedAction struct {
	ID           int64  `json:"id"`
	OpType       int    `json:"opType"`
	ActUserID    int64  `json:"actUserId"`
	ActUserName  string `json:"actUserName"`
	ActAvatar    string `json:"actAvatar"`
	RepoID       int64  `json:"repoId"`
	RepoUserName string `json:"repoUserName"`
	RepoName     string `json:"repoName"`
	RefName      string `json:"refName"`
	IsPrivate    bool   `json:"isPrivate"`
	Content      string `json:"content"`
	CreatedUnix  int64  `json:"createdUnix"`
}

type dashboardRepo struct {
	ID        int64  `json:"id"`
	OwnerName string `json:"ownerName"`
	Name      string `json:"name"`
	FullName  string `json:"fullName"`
	NumStars  int    `json:"numStars"`
	IsFork    bool   `json:"isFork"`
	IsPrivate bool   `json:"isPrivate"`
	IsMirror  bool   `json:"isMirror"`
}

type dashboardOrg struct {
	ID       int64  `json:"id"`
	Name     string `json:"name"`
	NumRepos int    `json:"numRepos"`
}

type getDashboardResponse struct {
	Feeds              []dashboardFeedAction `json:"feeds"`
	Repos              []dashboardRepo       `json:"repos"`
	CollaborativeRepos []dashboardRepo       `json:"collaborativeRepos"`
	Mirrors            []dashboardRepo       `json:"mirrors"`
	Orgs               []dashboardOrg        `json:"orgs"`
}

func getDashboard(r *http.Request, u *database.User) (statusCode int, resp *getDashboardResponse, err error) {
	if u == nil {
		return http.StatusUnauthorized, nil, nil
	}

	ctx := r.Context()

	// 1. Feeds
	actions, err := database.Handle.Actions().ListByUser(ctx, u.ID, u.ID, 0, false)
	if err != nil {
		log.Error("getDashboard: list actions: %v", err)
		return http.StatusInternalServerError, nil, errors.Wrap(err, "list actions")
	}

	feeds := make([]dashboardFeedAction, 0, len(actions))
	unameAvatars := make(map[string]string)
	for _, act := range actions {
		if _, ok := unameAvatars[act.ActUserName]; !ok {
			if actUser, err := database.Handle.Users().GetByUsername(ctx, act.ActUserName); err == nil {
				unameAvatars[act.ActUserName] = actUser.AvatarURLPath()
			}
		}
		feeds = append(feeds, dashboardFeedAction{
			ID:           act.ID,
			OpType:       int(act.OpType),
			ActUserID:    act.ActUserID,
			ActUserName:  act.ActUserName,
			ActAvatar:    unameAvatars[act.ActUserName],
			RepoID:       act.RepoID,
			RepoUserName: act.RepoUserName,
			RepoName:     act.RepoName,
			RefName:      act.RefName,
			IsPrivate:    act.IsPrivate,
			Content:      act.Content,
			CreatedUnix:  act.CreatedUnix,
		})
	}

	// 2. Orgs
	dbOrgs, err := database.Handle.Organizations().List(
		ctx,
		database.ListOrgsOptions{
			MemberID:              u.ID,
			IncludePrivateMembers: true,
		},
	)
	if err != nil {
		log.Error("getDashboard: list organizations: %v", err)
		return http.StatusInternalServerError, nil, errors.Wrap(err, "list organizations")
	}

	orgs := make([]dashboardOrg, 0, len(dbOrgs))
	for _, o := range dbOrgs {
		orgs = append(orgs, dashboardOrg{
			ID:       o.ID,
			Name:     o.Name,
			NumRepos: o.NumRepos,
		})
	}

	// 3. Collaborative Repos
	dbCollabRepos, err := database.Handle.Repositories().GetByCollaboratorID(ctx, u.ID, conf.UI.User.RepoPagingNum, "updated_unix DESC")
	if err != nil {
		log.Error("getDashboard: get collaborative repos: %v", err)
		return http.StatusInternalServerError, nil, errors.Wrap(err, "get collaborative repos")
	}
	if err = database.RepositoryList(dbCollabRepos).LoadAttributes(); err != nil {
		log.Error("getDashboard: load collab attributes: %v", err)
		return http.StatusInternalServerError, nil, errors.Wrap(err, "load collab attributes")
	}

	collabRepos := make([]dashboardRepo, 0, len(dbCollabRepos))
	for _, repo := range dbCollabRepos {
		collabRepos = append(collabRepos, dashboardRepo{
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

	// 4. Own Repos
	dbRepos, err := database.GetUserRepositories(&database.UserRepoOptions{
		UserID:   u.ID,
		Private:  true,
		Page:     1,
		PageSize: conf.UI.User.RepoPagingNum,
	})
	if err != nil {
		log.Error("getDashboard: get user repos: %v", err)
		return http.StatusInternalServerError, nil, errors.Wrap(err, "get user repos")
	}

	repos := make([]dashboardRepo, 0, len(dbRepos))
	for _, repo := range dbRepos {
		repos = append(repos, dashboardRepo{
			ID:        repo.ID,
			OwnerName: u.Name,
			Name:      repo.Name,
			FullName:  repo.FullName(),
			NumStars:  repo.NumStars,
			IsFork:    repo.IsFork,
			IsPrivate: repo.IsPrivate,
			IsMirror:  repo.IsMirror,
		})
	}

	// 5. Mirrors
	dbMirrors, err := database.GetUserMirrorRepositories(u.ID)
	if err != nil {
		log.Error("getDashboard: get user mirrors: %v", err)
		return http.StatusInternalServerError, nil, errors.Wrap(err, "get user mirrors")
	}

	mirrors := make([]dashboardRepo, 0, len(dbMirrors))
	for _, repo := range dbMirrors {
		mirrors = append(mirrors, dashboardRepo{
			ID:        repo.ID,
			OwnerName: u.Name,
			Name:      repo.Name,
			FullName:  repo.FullName(),
			NumStars:  repo.NumStars,
			IsFork:    repo.IsFork,
			IsPrivate: repo.IsPrivate,
			IsMirror:  repo.IsMirror,
		})
	}

	return http.StatusOK, &getDashboardResponse{
		Feeds:              feeds,
		Repos:              repos,
		CollaborativeRepos: collabRepos,
		Mirrors:            mirrors,
		Orgs:               orgs,
	}, nil
}
