export interface User {
	userId: Number,
	userName: String,
	role: Number,
	token: String;
	tokenType: String;
	expiredAt: Date;
}
