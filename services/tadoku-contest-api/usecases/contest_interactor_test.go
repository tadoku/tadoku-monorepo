package usecases_test

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/domain"
	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/usecases"

	gomock "github.com/golang/mock/gomock"
)

func setupContestTest(t *testing.T) (
	*gomock.Controller,
	*usecases.MockContestRepository,
	*usecases.MockValidator,
	usecases.ContestInteractor,
) {
	ctrl := gomock.NewController(t)

	repo := usecases.NewMockContestRepository(ctrl)
	validator := usecases.NewMockValidator(ctrl)
	interactor := usecases.NewContestInteractor(repo, validator)

	return ctrl, repo, validator, interactor
}

func TestContestInteractor_CreateContest(t *testing.T) {
	ctrl, repo, validator, interactor := setupContestTest(t)
	defer ctrl.Finish()

	{
		contest := domain.Contest{
			Start: time.Date(2019, 1, 1, 0, 0, 0, 0, time.UTC),
			End:   time.Date(2019, 1, 31, 0, 0, 0, 0, time.UTC),
			Open:  true,
		}

		repo.EXPECT().Store(&contest)
		repo.EXPECT().GetOpenContests().Return(nil, nil)
		validator.EXPECT().Validate(contest).Return(true, nil)

		err := interactor.CreateContest(contest)

		assert.NoError(t, err)
	}

	{
		contest := domain.Contest{
			Start: time.Date(2019, 1, 1, 0, 0, 0, 0, time.UTC),
			End:   time.Date(2019, 1, 31, 0, 0, 0, 0, time.UTC),
			Open:  true,
		}

		repo.EXPECT().GetOpenContests().Return([]uint64{1}, usecases.ErrOpenContestAlreadyExists)
		validator.EXPECT().Validate(contest).Return(true, nil)

		err := interactor.CreateContest(contest)

		assert.EqualError(t, err, usecases.ErrOpenContestAlreadyExists.Error())
	}

	{
		contest := domain.Contest{
			Start: time.Date(2019, 1, 31, 0, 0, 0, 0, time.UTC),
			End:   time.Date(2019, 1, 1, 0, 0, 0, 0, time.UTC),
			Open:  true,
		}

		validator.EXPECT().Validate(contest).Return(false, usecases.ErrInvalidContest)

		err := interactor.CreateContest(contest)

		assert.EqualError(t, err, usecases.ErrInvalidContest.Error())
	}
}

func TestContestInteractor_UpdateContest(t *testing.T) {
	ctrl, repo, validator, interactor := setupContestTest(t)
	defer ctrl.Finish()

	{
		contest := domain.Contest{
			ID:    1,
			Start: time.Date(2019, 1, 1, 0, 0, 0, 0, time.UTC),
			End:   time.Date(2019, 1, 31, 0, 0, 0, 0, time.UTC),
			Open:  false,
		}

		repo.EXPECT().Store(&contest)
		validator.EXPECT().Validate(contest).Return(true, nil)

		err := interactor.UpdateContest(contest)

		assert.NoError(t, err)
	}

	{
		contest := domain.Contest{
			Start: time.Date(2019, 1, 1, 0, 0, 0, 0, time.UTC),
			End:   time.Date(2019, 1, 31, 0, 0, 0, 0, time.UTC),
			Open:  false,
		}

		err := interactor.UpdateContest(contest)

		assert.EqualError(t, err, usecases.ErrContestIDMissing.Error())
	}
}

func TestContestInteractor_Recent(t *testing.T) {
	ctrl, repo, _, interactor := setupContestTest(t)
	defer ctrl.Finish()

	// Happy path
	{
		contests := []domain.Contest{
			{
				ID:    1,
				Start: time.Date(2019, 1, 1, 0, 0, 0, 0, time.UTC),
				End:   time.Date(2019, 1, 31, 0, 0, 0, 0, time.UTC),
				Open:  false,
			},
			{
				ID:    2,
				Start: time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
				End:   time.Date(2020, 1, 31, 0, 0, 0, 0, time.UTC),
				Open:  true,
			},
		}

		repo.EXPECT().FindRecent(2).Return(contests, nil)

		found, err := interactor.Recent(2)
		assert.NoError(t, err)
		assert.ElementsMatch(t, contests, found)
	}

	// Sad path: none found
	{
		repo.EXPECT().FindRecent(2).Return([]domain.Contest{}, domain.ErrNotFound)

		_, err := interactor.Recent(2)
		assert.EqualError(t, err, usecases.ErrContestNotFound.Error())
	}
}

func TestContestInteractor_Find(t *testing.T) {
	ctrl, repo, _, interactor := setupContestTest(t)
	defer ctrl.Finish()

	contestID := uint64(1)

	// Happy path
	{
		contest := domain.Contest{
			ID:    contestID,
			Start: time.Date(2019, 1, 1, 0, 0, 0, 0, time.UTC),
			End:   time.Date(2019, 1, 31, 0, 0, 0, 0, time.UTC),
			Open:  false,
		}

		repo.EXPECT().FindByID(contestID).Return(contest, nil)

		found, err := interactor.Find(contestID)
		assert.NoError(t, err)
		assert.Equal(t, &contest, found)
	}

	// Sad path: none found
	{
		repo.EXPECT().FindByID(contestID).Return(domain.Contest{}, domain.ErrNotFound)

		_, err := interactor.Find(contestID)
		assert.EqualError(t, err, usecases.ErrContestNotFound.Error())
	}
}
