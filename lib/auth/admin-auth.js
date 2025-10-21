import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { getAdminByUsername, updateLastLogin } from '../supabase/queries';

const TOKEN_EXPIRY = '7d'; // 7 days

/**
 * Get JWT_SECRET from environment as Uint8Array for jose
 * @returns {Uint8Array} - JWT secret as bytes
 */
function getJWTSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  // Convert string to Uint8Array for jose
  return new TextEncoder().encode(secret);
}

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if password matches
 */
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for an admin user
 * @param {object} admin - Admin user object
 * @returns {string} - JWT token
 */
export async function generateToken(admin) {
  const JWT_SECRET = getJWTSecret();
  const payload = {
    id: admin.id,
    username: admin.username,
    role: admin.role,
    full_name: admin.full_name
  };
  
  console.log('Generating token with payload:', payload);
  console.log('Using JWT_SECRET length:', JWT_SECRET?.length);
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
  
  console.log('Token generated, preview:', token.substring(0, 20) + '...');
  return token;
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token payload or null if invalid
 */
export async function verifyToken(token) {
  try {
    const JWT_SECRET = getJWTSecret();
    console.log('Verifying token...');
    console.log('JWT_SECRET exists:', !!JWT_SECRET);
    console.log('JWT_SECRET length:', JWT_SECRET?.length);
    console.log('Token preview:', token?.substring(0, 20) + '...');
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('Token verified successfully:', payload);
    return payload;
  } catch (error) {
    console.error('Token verification error:', error.message);
    console.error('Error name:', error.name);
    return null;
  }
}

/**
 * Authenticate an admin user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<object>} - { success, token, admin, error }
 */
export async function authenticateAdmin(username, password) {
  try {
    // Get admin user from database
    const admin = await getAdminByUsername(username);
    
    if (!admin) {
      return {
        success: false,
        error: 'Invalid username or password'
      };
    }
    
    // Verify password
    const isValid = await verifyPassword(password, admin.password_hash);
    
    if (!isValid) {
      return {
        success: false,
        error: 'Invalid username or password'
      };
    }
    
    // Update last login
    await updateLastLogin(admin.id);
    
    // Generate token
    const token = await generateToken(admin);
    
    // Remove password hash from response
    const { password_hash, ...adminData } = admin;
    
    return {
      success: true,
      token,
      admin: adminData
    };
    
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed. Please try again.'
    };
  }
}

/**
 * Get admin user from token
 * @param {string} token - JWT token
 * @returns {Promise<object|null>} - Admin user data or null
 */
export async function getAdminFromToken(token) {
  const decoded = await verifyToken(token);
  
  if (!decoded) {
    return null;
  }
  
  return {
    id: decoded.id,
    username: decoded.username,
    role: decoded.role,
    full_name: decoded.full_name
  };
}
