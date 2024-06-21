type FlashMessage = { status: "success" | "info" | "warning" | "error"; text: string };

type EmailFormField = { email: string };
type NameFormField = { name: string };
type PasswordFormField = { password: string };
type PasswordConfirmFormField = { passwordConfirm: string };
type TokenFormField = { token: string };
type UsernameFormField = { username: string };
type IsAdminFormField = { isAdmin: boolean };
type IsVerifiedFormField = { isVerified: boolean };
