export interface User {
    idUser: string | number,
    name: string,
    lastName: string,
    username: string,
    email: string,
    password: string | null,
    passwordCon: string | null,
    photo: string,
}
