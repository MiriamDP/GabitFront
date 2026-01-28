export interface User {
    idUser: string | number,
    name: string,
    lastName: string,
    username: string,
    rol: string,
    email: string,
    password: string | null,
    passwordCon: string | null,
    photo: string,
}
