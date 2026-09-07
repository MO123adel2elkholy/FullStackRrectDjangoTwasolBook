import axios from 'axios';

  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || '';
  const clientId = import.meta.env.VITE_CLIENT_ID || '';
  const clientSecret = import.meta.env.VITE_CLIENT_SECRET || '';
  const grantType = import.meta.env.VITE_GRANT_TYPE || 'password';
  const server_url = import.meta.VITE_API_BASE_URL||'http://127.0.0.1:8000'
const facebookSocialLogin = (accesstoken) => {
	console.log(accesstoken);
	axios
		.post(`${server_url}/auth/convert-token`, {
			token: accesstoken,
			backend: 'facebook', // the backed used for authenttications 
			grant_type: grantType,
            client_id: clientId,
            client_secret: clientSecret,
		})
		.then((res) => {
			localStorage.setItem('access_token', res.data.access_token);
			localStorage.setItem('refresh_token', res.data.refresh_token);
		});
};

export default facebookSocialLogin;
