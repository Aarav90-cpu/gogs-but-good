package web

import (
	"net/http"
	"strconv"

	"github.com/cockroachdb/errors"
	"gogs.io/gogs/internal/conf"
	"gogs.io/gogs/internal/database"
	log "unknwon.dev/clog/v2"
)

type exploreRepo struct {
	ID        int64  `json:"id"`
	OwnerName string `json:"ownerName"`
	Name      string `json:"name"`
	FullName  string `json:"fullName"`
	NumStars  int    `json:"numStars"`
	IsFork    bool   `json:"isFork"`
	IsPrivate bool   `json:"isPrivate"`
	IsMirror  bool   `json:"isMirror"`
	Description string `json:"description"`
	UpdatedUnix int64 `json:"updatedUnix"`
}

type exploreUser struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	FullName  string `json:"fullName"`
	AvatarURL string `json:"avatarUrl"`
	Location  string `json:"location"`
	Website   string `json:"website"`
	CreatedUnix int64 `json:"createdUnix"`
}

type getExploreReposResponse struct {
	Repos []exploreRepo `json:"repos"`
	Total int64         `json:"total"`
	Page  int           `json:"page"`
}

func getExploreRepos(r *http.Request, u *database.User) (statusCode int, resp *getExploreReposResponse, err error) {

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page <= 0 {
		page = 1
	}
	keyword := r.URL.Query().Get("q")

	var userID int64
	if u != nil {
		userID = u.ID
	}

	dbRepos, count, err := database.SearchRepositoryByName(&database.SearchRepoOptions{
		Keyword:  keyword,
		UserID:   userID,
		OrderBy:  "updated_unix DESC",
		Page:     page,
		PageSize: conf.UI.ExplorePagingNum,
	})
	if err != nil {
		log.Error("getExploreRepos: search repos: %v", err)
		return http.StatusInternalServerError, nil, errors.Wrap(err, "search repos")
	}

	if err = database.RepositoryList(dbRepos).LoadAttributes(); err != nil {
		log.Error("getExploreRepos: load attributes: %v", err)
		return http.StatusInternalServerError, nil, errors.Wrap(err, "load attributes")
	}

	repos := make([]exploreRepo, 0, len(dbRepos))
	for _, repo := range dbRepos {
		repos = append(repos, exploreRepo{
			ID:        repo.ID,
			OwnerName: repo.Owner.Name,
			Name:      repo.Name,
			FullName:  repo.FullName(),
			NumStars:  repo.NumStars,
			IsFork:    repo.IsFork,
			IsPrivate: repo.IsPrivate,
			IsMirror:  repo.IsMirror,
			Description: repo.Description,
			UpdatedUnix: repo.UpdatedUnix,
		})
	}

	return http.StatusOK, &getExploreReposResponse{
		Repos: repos,
		Total: count,
		Page:  page,
	}, nil
}

type getExploreUsersResponse struct {
	Users []exploreUser `json:"users"`
	Total int64         `json:"total"`
	Page  int           `json:"page"`
}

func getExploreUsers(r *http.Request) (statusCode int, resp *getExploreUsersResponse, err error) {
	ctx := r.Context()
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page <= 0 {
		page = 1
	}
	keyword := r.URL.Query().Get("q")

	var dbUsers []*database.User
	var count int64

	if keyword == "" {
		dbUsers, err = database.Handle.Users().List(ctx, page, conf.UI.ExplorePagingNum)
		if err != nil {
			log.Error("getExploreUsers: list users: %v", err)
			return http.StatusInternalServerError, nil, errors.Wrap(err, "list users")
		}
		count = database.Handle.Users().Count(ctx)
	} else {
		dbUsers, count, err = database.Handle.Users().SearchByName(ctx, keyword, page, conf.UI.ExplorePagingNum, "updated_unix DESC")
		if err != nil {
			log.Error("getExploreUsers: search users: %v", err)
			return http.StatusInternalServerError, nil, errors.Wrap(err, "search users")
		}
	}

	users := make([]exploreUser, 0, len(dbUsers))
	for _, user := range dbUsers {
		users = append(users, exploreUser{
			ID:        user.ID,
			Name:      user.Name,
			FullName:  user.FullName,
			AvatarURL: user.AvatarURLPath(),
			Location:  user.Location,
			Website:   user.Website,
			CreatedUnix: user.CreatedUnix,
		})
	}

	return http.StatusOK, &getExploreUsersResponse{
		Users: users,
		Total: count,
		Page:  page,
	}, nil
}

func getExploreOrgs(r *http.Request) (statusCode int, resp *getExploreUsersResponse, err error) {
	ctx := r.Context()
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page <= 0 {
		page = 1
	}
	keyword := r.URL.Query().Get("q")

	var dbUsers []*database.User
	var count int64

	if keyword == "" {
		dbUsers, err = database.Organizations(page, conf.UI.ExplorePagingNum)
		if err != nil {
			log.Error("getExploreOrgs: list orgs: %v", err)
			return http.StatusInternalServerError, nil, errors.Wrap(err, "list orgs")
		}
		count = database.CountOrganizations()
	} else {
		dbUsers, count, err = database.Handle.Organizations().SearchByName(ctx, keyword, page, conf.UI.ExplorePagingNum, "updated_unix DESC")
		if err != nil {
			log.Error("getExploreOrgs: search orgs: %v", err)
			return http.StatusInternalServerError, nil, errors.Wrap(err, "search orgs")
		}
	}

	orgs := make([]exploreUser, 0, len(dbUsers))
	for _, user := range dbUsers {
		orgs = append(orgs, exploreUser{
			ID:        user.ID,
			Name:      user.Name,
			FullName:  user.FullName,
			AvatarURL: user.AvatarURLPath(),
			Location:  user.Location,
			Website:   user.Website,
			CreatedUnix: user.CreatedUnix,
		})
	}

	return http.StatusOK, &getExploreUsersResponse{
		Users: orgs,
		Total: count,
		Page:  page,
	}, nil
}
