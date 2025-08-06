const passport = require('passport');
const User = require('../models/User');
const { google } = require('googleapis');

// Google Login - Initiates Google OAuth flow
exports.googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly'], // Add the required Gmail scopes
});

// Google OAuth Callback - Handles the callback from Google after successful authentication
exports.googleCallback = passport.authenticate('google', {
  successRedirect: 'http://localhost:3000/dashboard',  // Redirect to React app dashboard
  failureRedirect: 'http://localhost:3000/login',      // Redirect to React app login
});

// Check if the user is authenticated before accessing protected routes
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware
  }
  res.status(401).json({ message: 'User not authenticated' });
};

// User Logout - Ends the user's session
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error destroying session' });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
};

// Fetch the current authenticated user's profile
exports.getUserProfile = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  
  // Return the user profile from the session
  res.status(200).json({
    user: req.user,
  });
};

// Debug endpoint to check token scopes
exports.checkTokenScopes = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken,
    });

    // Get token info to see what scopes are available
    const tokenInfo = await oauth2Client.getTokenInfo(req.user.accessToken);
    
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      },
      tokenInfo: tokenInfo,
      hasGmailReadScope: tokenInfo.scopes.includes('https://www.googleapis.com/auth/gmail.readonly'),
      hasGmailSendScope: tokenInfo.scopes.includes('https://www.googleapis.com/auth/gmail.send'),
      allScopes: tokenInfo.scopes
    });
  } catch (error) {
    console.error('Error checking token scopes:', error);
    res.status(500).json({ 
      message: 'Error checking token scopes', 
      error: error.message,
      needsReauth: true 
    });
  }
};
