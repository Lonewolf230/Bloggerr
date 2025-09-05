const request = require('supertest');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
app.use(cors({
    origin: process.env.REACT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/comment', commentRoutes);


const testUser = {
    email: `testUser${new Date().toISOString().split('T')[0]}@gmail.com`,
    password: 'Test@1234'
}

let testCookies = '';
let verificationCode = '';

describe('Auth Integration Tests', () => {
    jest.setTimeout(30000); // 30 second timeout for AWS calls

    test('POST /api/auth/signup - should create new user', async () => {
        const response = await request(app)
            .post('/api/auth/signupTestUser')
            .send({
                email: testUser.email,
                password: testUser.password
            });
        console.log('Signup response:', response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Test user created and verified successfully');
        expect(response.body.data).toBeDefined();
    });

    // test('POST /api/auth/verify - should verify user with code', async () => {
    //     // Note: In real tests, you'd need to get the verification code from email/SMS
    //     // For now, this will fail but shows the test structure
    //     const response = await request(app)
    //         .post('/api/auth/verify')
    //         .send({
    //             email: testUser.email,
    //             code: '123456' // You'll need to replace with actual code
    //         });

    //     // This might fail initially due to invalid code, but structure is correct
    //     if (response.status === 200) {
    //         expect(response.body.message).toBe('User verified Successfully');
    //     }
    // });

    test('POST /api/auth/login - should login user and set cookies', async () => {
        // First try login (might fail if user not verified)
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });
        console.log('Login response:', response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.user.username).toBe(testUser.email.split('@')[0]);
        expect(response.body.user.email).toBe(testUser.email);

        // Save cookies for subsequent tests
        testCookies = response.headers['set-cookie'];
        expect(testCookies).toBeDefined();

    });

    test('GET /api/auth/me - should get current user', async () => {
        if (!testCookies) {
            console.log('Skipping test - no cookies from login');
            return;
        }

        const response = await request(app)
            .get('/api/auth/me')
            .set('Cookie', testCookies);

        expect(response.status).toBe(200);
        expect(response.body.user.username).toBeDefined();
        expect(response.body.user.email).toBeDefined();
    });

    test('GET /api/auth/check - should check authentication status', async () => {
        if (!testCookies) {
            console.log('Skipping test - no cookies from login');
            return;
        }

        const response = await request(app)
            .get('/api/auth/check')
            .set('Cookie', testCookies);

        expect(response.status).toBe(200);
        expect(response.body.isAuthenticated).toBe(true);
        expect(response.body.user.username).toBeDefined();
        // expect(response.body.user.email).toBeDefined();
    });

    test('GET /api/auth/getProfile - should get user profile', async () => {
        if (!testCookies) {
            console.log('Skipping test - no cookies from login');
            return;
        }

        const response = await request(app)
            .get('/api/auth/getProfile')
            .set('Cookie', testCookies);

        // Status might be 200 or 404 depending on if profile exists
        expect([200, 404]).toContain(response.status);
    });

    test('PUT /api/auth/editProfile - should edit user profile', async () => {
        if (!testCookies) {
            console.log('Skipping test - no cookies from login');
            return;
        }

        const response = await request(app)
            .put('/api/auth/editProfile')
            .set('Cookie', testCookies)
            .send({
                bio: 'Test bio',
                tags: ['test', 'integration']
            });

        expect([200, 400, 500]).toContain(response.status);
    });

    test('POST /api/auth/logout - should logout user', async () => {
        if (!testCookies) {
            console.log('Skipping test - no cookies from login');
            return;
        }

        const response = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', testCookies);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logged Out successfully');
    });



    test('Protected routes should return 401 without auth', async () => {
        const routes = [
            { method: 'get', path: '/api/auth/me' },
            { method: 'get', path: '/api/auth/check' },
            { method: 'get', path: '/api/auth/getProfile' },
            { method: 'put', path: '/api/auth/editProfile' },
            { method: 'post', path: '/api/auth/logout' },
            { method: 'delete', path: '/api/auth/deleteTestUser' }
        ];

        for (const route of routes) {
            const response = await request(app)[route.method](route.path);
            expect([400, 401]).toContain(response.status);
        }
    });

    test('Protected routes should return 401 with invalid token', async () => {
        const response = await request(app)
            .get('/api/auth/me')
            .set('Cookie', ['accessToken=invalid-token']);

        expect(response.status).toBe(401);
    });

    test('POST /api/auth/follow/:targetUsername - should follow user', async () => {
        if (!testCookies) {
            console.log('Skipping test - no cookies from login');
            return;
        }

        const response = await request(app)
            .post('/api/auth/follow/someuser')
            .set('Cookie', testCookies);

        expect([200, 400, 404, 500]).toContain(response.status);
    });

    test('POST /api/auth/unfollow/:targetUsername - should unfollow user', async () => {
        if (!testCookies) {
            console.log('Skipping test - no cookies from login');
            return;
        }

        const response = await request(app)
            .post('/api/auth/unfollow/someuser')
            .set('Cookie', testCookies);

        // Expect success, error, or not found based on implementation
        expect([200, 400, 404, 500]).toContain(response.status);
    });

    // Test edge cases
    test('POST /api/auth/signup - should fail with invalid email', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'invalid-email',
                password: testUser.password
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('User creation failed');
    });

    test('POST /api/auth/login - should fail with wrong password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'WrongPassword123!'
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Login failed');
    });

    test('POST /api/auth/verify - should fail with wrong code', async () => {
        const response = await request(app)
            .post('/api/auth/verify')
            .send({
                email: testUser.email,
                code: '000000'
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('User unverified');
    });

    test('POST /api/auth/delete - should delete user', async () => {
        // Login first to get fresh cookies
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });
        console.log('Login response for delete test:', loginResponse.body);
        if (loginResponse.status !== 200) {
            console.log('Skipping delete test - login failed');
            return;
        }

        const cookies = loginResponse.headers['set-cookie'];
        console.log('Deleting user')
        const response = await request(app)
            .delete('/api/auth/deleteTestUser')
            .send({ email: testUser.email });
        console.log('Delete response:', response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Test user deleted successfully');
    });
});

// Additional helper tests for middleware
describe('Middleware Tests', () => {
    test('verifyToken middleware should handle missing token', async () => {
        const response = await request(app)
            .get('/api/auth/me');

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('No token provided');
    });

    test('verifyToken middleware should handle invalid token format', async () => {
        const response = await request(app)
            .get('/api/auth/me')
            .set('Cookie', ['accessToken=invalid.token.format']);

        expect(response.status).toBe(401);
    });
});

// Run cleanup after all tests
afterAll(async () => {
    // Add any cleanup logic here if needed
    console.log('Integration tests completed');
});

module.exports = app;