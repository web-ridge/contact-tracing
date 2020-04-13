package database

import (
	"time"

	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/joho/godotenv/autoload"
)

type InfectionCode struct {
	ID        uint       `gorm:"primary_key" json:"id"`
	Code      string     `gorm:"index:code" json:"code`
	Hash      string     `gorm:"index:hash" json:"hash`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `sql:"index" json:"deletedAt"`
}

// GGD Zeeland etc
type Company struct {
	ID        uint       `gorm:"primary_key" json:"id"`
	Name      string     `json:"name"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `sql:"index" json:"deletedAt"`
}

// Someone who works for GGD
type User struct {
	ID           uint    `gorm:"primary_key" json:"id"`
	Email        string  `json:"email"`
	PasswordHash []byte  `json:"-"`
	Company      Company `json:"company"`
	// Role =
	// "admin" for creating everything like users + infection companies
	// "manager" for creating users who manage infection company and can add users there
	// "employee" // can only add infection
	Role      string     `json:"role"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `sql:"index" json:"deletedAt"`
}

//IsUserCreatePermitted checks if an authorized user can create user
func IsUserCreatePermitted(authorizedUser *User, userToCreate *User) bool {
	// admin can add all sorts of users
	if authorizedUser.Role == "admin" {
		return true
	}

	sameCompany := userToCreate.Company.ID == authorizedUser.ID

	// manager is only allowed to create employee's
	if authorizedUser.Role == "manager" {
		return sameCompany && userToCreate.Role == "employee"
	}

	// employee is not allowed to create users
	return false
}

func IsCompanyCreatePermitted(authorizedUser *User, companyToCreate *Company) bool {
	if authorizedUser.Role == "admin" {
		return true
	}
	return false
}
