import api from '../api'; // Your Axios instance

export const sendTokensToBackend = async (accessToken, refreshToken) => {
  try {
    // You can POST to a /auth/tokens endpoint or any endpoint you want
    const response = await api.post('/auth/tokens', {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-refresh-token': refreshToken
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send tokens to backend:', error);
    throw error;
  }
};