// Import necessary React hooks for state management and navigation
import React, { useState, useContext } from 'react';
// Import navigation hook from react-router-dom to programmatically navigate between pages
import { useNavigate, Link } from 'react-router-dom';
// Import the AuthContext to access the login function from the context
import { AuthContext } from '../context/AuthContext';
// Import the Loader2 spinner icon from lucide-react for loading animation
import { Loader2 } from 'lucide-react';

/**
 * Login Component
 * This component renders a login page where users can enter their credentials
 * to authenticate and access the application
 */
const Login = () => {
  // State variable for storing the email input value
  const [email, setEmail] = useState('');
  
  // State variable for storing the password input value
  const [password, setPassword] = useState('');
  
  // State variable for storing error messages from failed login attempts
  const [error, setError] = useState('');
  
  // State variable to track loading state during login process
  const [loading, setLoading] = useState(false);
  
  // Destructure the login function from AuthContext to perform authentication
  const { login } = useContext(AuthContext);
  
  // Hook for programmatically navigating to different routes after successful login
  const navigate = useNavigate();

  /**
   * handleSubmit function
   * Handles form submission for user login
   * @async
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();
    
    // Clear any existing error messages
    setError('');
    
    // Set loading state to true to disable the submit button and show spinner
    setLoading(true);
    
    try {
      // Call the login function from AuthContext with user credentials
      await login(email, password);
      
      // If login is successful, navigate to the home page
      navigate('/');
    } catch (err) {
      // If login fails, display the error message from the server or a generic error
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      // Set loading state back to false after login attempt completes (success or failure)
      setLoading(false);
    }
  };

  // JSX return statement - renders the login form UI
  return (
    // Container div for the entire authentication section
    <div className="auth-container">
      {/* Card container that holds the login form */}
      <div className="auth-card">
        {/* Page heading "Welcome Back" */}
        <h2>Welcome Back</h2>
        
        {/* Conditionally render error message if one exists */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Form element with handleSubmit as submission handler */}
        <form onSubmit={handleSubmit}>
          {/* Email input field group */}
          <div className="form-group">
            {/* Label for email input */}
            <label>Email Address</label>
            
            {/* Email input field that updates email state on change */}
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          {/* Password input field group */}
          <div className="form-group">
            {/* Label for password input */}
            <label>Password</label>
            
            {/* Password input field that updates password state on change */}
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          {/* Submit button for the login form */}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {/* Show loading spinner if request is in progress, otherwise show 'Enter' text */}
            {loading ? <Loader2 className="loader" /> : 'Enter'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

// Export the Login component as the default export for this file
export default Login;
