package main

import (
	"context"
	"net/http"

	"github.com/jinzhu/gorm"
	"github.com/web-ridge/contact-tracing/backend/database"
	"github.com/web-ridge/contact-tracing/backend/handler"
	"golang.org/x/crypto/bcrypt"
)

// A private key for context that only this package can access. This is important
// to prevent collisions between different context uses
var userCtxKey = &contextKey{"user"}

type contextKey struct {
	name string
}

// AuthMiddleware ...
func AuthMiddleware(db *gorm.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			email, password, ok := r.BasicAuth()
			if !ok {
				handler.WriteAuthError(w)
				return
			}

			// get user from database
			var user database.User
			if err := db.Model(&database.User{}).Where(&database.User{
				Email: email,
			}).First(&user).Error; err != nil {
				handler.WriteAuthError(w)
				return
			}

			// check if password is right
			if err := bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(password)); err != nil {
				handler.WriteAuthError(w)
				return
			}

			// put the user in context so it can be used in resolvers
			ctx := context.WithValue(r.Context(), userCtxKey, user)

			// and call the next with our new context
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
