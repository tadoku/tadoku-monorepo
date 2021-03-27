package services

import (
	"net/http"
	"strconv"

	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/domain"
	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/usecases"
)

// RankingService is responsible for managing rankings
type RankingService interface {
	Create(ctx Context) error
	Get(ctx Context) error
	CurrentRegistration(ctx Context) error
	RankingsForRegistration(ctx Context) error
}

// NewRankingService initializer
func NewRankingService(rankingInteractor usecases.RankingInteractor) RankingService {
	return &rankingService{
		RankingInteractor: rankingInteractor,
	}
}

type rankingService struct {
	RankingInteractor usecases.RankingInteractor
}

// CreateRankingPayload payload for the create action
type CreateRankingPayload struct {
	ContestID uint64               `json:"contest_id"`
	Languages domain.LanguageCodes `json:"languages"`
}

func (s *rankingService) Create(ctx Context) error {
	payload := &CreateRankingPayload{}
	if err := ctx.Bind(payload); err != nil {
		return domain.WrapError(err)
	}

	user, err := ctx.User()
	if err != nil {
		return domain.WrapError(err)
	}

	if err := s.RankingInteractor.CreateRanking(payload.ContestID, user.ID, payload.Languages); err != nil {
		return domain.WrapError(err)
	}

	return ctx.NoContent(http.StatusCreated)
}

func (s *rankingService) Get(ctx Context) error {
	contestID, err := strconv.ParseUint(ctx.QueryParam("contest_id"), 10, 64)
	if err != nil {
		return domain.WrapError(err)
	}
	language := domain.LanguageCode(ctx.QueryParam("language"))

	rankings, err := s.RankingInteractor.RankingsForContest(contestID, language)
	if err != nil {
		if err == usecases.ErrNoRankingsFound {
			return ctx.NoContent(http.StatusNotFound)
		}

		return domain.WrapError(err)
	}

	return ctx.JSON(http.StatusOK, rankings.GetView())
}

func (s *rankingService) CurrentRegistration(ctx Context) error {
	user, err := ctx.User()
	if err != nil {
		return domain.WrapError(err)
	}

	registration, err := s.RankingInteractor.CurrentRegistration(user.ID)
	if err != nil {
		if err == usecases.ErrNoRankingRegistrationFound {
			return ctx.NoContent(http.StatusNotFound)
		}

		return domain.WrapError(err)
	}

	return ctx.JSON(http.StatusOK, registration)
}

func (s *rankingService) RankingsForRegistration(ctx Context) error {
	contestID, err := strconv.ParseUint(ctx.QueryParam("contest_id"), 10, 64)
	if err != nil {
		return domain.WrapError(err)
	}
	userID, err := strconv.ParseUint(ctx.QueryParam("user_id"), 10, 64)
	if err != nil {
		return domain.WrapError(err)
	}

	rankings, err := s.RankingInteractor.RankingsForRegistration(contestID, userID)
	if err != nil {
		if err == usecases.ErrNoRankingsFound {
			return ctx.NoContent(http.StatusNotFound)
		}

		return domain.WrapError(err)
	}

	return ctx.JSON(http.StatusOK, rankings.GetView())
}
