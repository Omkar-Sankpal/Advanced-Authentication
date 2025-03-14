# :closed_lock_with_key: Advanced Authentication System 

- This project was made to understand how Authentication works manually via email verificaition and sending OTP's.  
- The Project mainly focuses on handling curcial information like session tokens and passwords.  
- It enables users to browse safely throughout their session as all the infomation is encrypted using essential React libraries like crypto and bcryptjs

  ## :star2: Features 

- Verify email via OTP 
- Forgot password and reset password secured with tokenization  
- Get a welcome email

  ## :rocket: Deployment 

- [Advanced authentication](https://advanced-authentication-1-2dpd.onrender.com) It may take some time to load... 

https://github.com/user-attachments/assets/16bbae40-c1a6-4e83-96f8-0710727cfb02

## Structure 
```
📦 Advanced-Auth
├── 📂 Backend
│    ├── 📂 Controllers
|    |    └── 📄 authcontrollers.js
│    ├── 📂 DB
│    |    └── 📄 ConnectDB.js
│    ├── 📂 MailTrap
│    |    └── 📄 EmailTemplate.js
│    |    └── 📄 Email.js
│    |    └── 📄 MailTrapConfig.js
│    ├── 📂 Middleware
│    |    └── 📄 VerifyToken.js
│    ├── 📂 Models
│    |    └── 📄 UserModel.js
│    ├── 📂 Utils
│    |    └── 📄 GenerateTokenSetCookie.js
│    ├── 📂 Routes
│    |    └── 📄 authRoutes.js
│    └── 📄 index.js
├── 📂 Frontend
│    ├── 📂 src
│         ├── 📂 Pages
│         |    └── 📄 EmailVerification.jsx
│         |    └── 📄 ForgotPassword.jsx
│         |    └── 📄 Home.jsx
│         |    └── 📄 Login.jsx
│         |    └── 📄 ResetPasswordPage.jsx
│         |    └── 📄 SignUp.jsx
│         ├── 📂 Store
│         |    └── 📄 authStore.jsx
│         ├── 📂 Utils
│         |    └── 📄 Date.js
│         └── 📂 components
│              └── 📄 FloatingShape.jsx
│              └── 📄 Input.jsx
│              └── 📄 LoadingSpinner.jsx
│              └── 📄 PasswordStrength.jsx
│    
├── 📄 .gitignore
├── 📄 README.md
└── 📄 package.json
└── 📄 package-lock.json
```


