
// 

const default_user = {
    email: "user@example.com",
    password: "password123"
};

export const login = (req, res) => {
    console.log(req.body); // req.body es un objeto con los datos enviados en el body de la petición
    const { email, password } = req.body;
    console.log(email, password); // ESTO SE BORRA ES SOLO PARA TESTEAR
   
    // Aquí iría la lógica para autenticar al usuario

    // Ejemplo de autenticación simple
    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" }); // no dar datos concretos para aumentar la seguridad contra ataques de fuerza bruta
    }

    // DESCONSTRUIR ES EL MEJOR DE LOS METODOS.
    if (email === default_user.email && password === default_user.password) {
        res.json({ message: "Login exitoso" });
    } else {
        res.status(401).json({ message: "Credenciales inválidas" });
    }
    
}

export const register = (req, res) => {
    console.log(req.body);  // req.body es un objeto con los datos enviados en el body de la petición
    const { email, password } = req.body;
    console.log(email, password);
    res.json({ message: "Registro recibido correctamente" });
    // Aquí iría la lógica para registrar al usuario
}

