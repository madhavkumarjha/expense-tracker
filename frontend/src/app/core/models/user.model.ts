interface user{
    name:string;
    email:string;
    password:string;
    avatar:string;
}

export class User implements user{
    name:string;
    email:string;
    password:string;
    avatar:string;

    constructor(name:string,email:string,password:string,avatar:string){
        this.name=name;
        this.email=email;
        this.password=password;
        this.avatar=avatar;
    }
}