package handler

import (
	"net/http"

	"github.com/go-redis/redis/v7"
	// "github.com/go-redis/redis_rate/v8"
	"github.com/jinzhu/gorm"
)

type Handler struct {
	db          *gorm.DB
	redisClient *redis.Client
	// limiter     *redis_rate.Limiter
	// limit       *redis_rate.Limit
}

func NewHandler(db *gorm.DB, redisClient *redis.Client) *Handler {
	return &Handler{
		db:          db,
		redisClient: redisClient,
	}
}

// GetIP gets a requests IP address by reading off the forwarded-for
// header (for proxies) and falls back to use the remote address.
func GetIP(r *http.Request) string {
	forwarded := r.Header.Get("X-FORWARDED-FOR")
	if forwarded != "" {
		return forwarded
	}
	return r.RemoteAddr
}

// return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 	IP := GetIP(r)
// 	res, err := l.limiter.Allow(IP, l.limit)
// 	if err != nil {
// 		log.Error().Err(err).Msg("Error while limiting requests")
// 	}
// 	if !res.Allowed {
// 		http.Error(w, "API rate limit exceeded.", 429)
// 		return
// 	}
// 	next.ServeHTTP(w, r)
// })
