

interface CreateUserInput {
  email:     String   
  password:  String
  name:      String  
  image?:    String
  phone?:    String
}

export class UserService {
    static async registration (userData: CreateUserInput) {

        const {email, password, name, image, phone} = userData

        const isNewUser = await prisma
    }
}