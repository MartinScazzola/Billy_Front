import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";

import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";

import { useNavigate } from "react-router-dom";

// Importar Firebase
import appFirebase from "../../src/credentials";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { dbUrl } from "../DBUrl";

// Obtener la instancia de autenticación de Firebase
const auth = getAuth(appFirebase);

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  name: HTMLInputElement;
  lastName: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}
interface SignUpFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<SignUpFormElement>) => {
    event.preventDefault();
    const formElements = event.currentTarget.elements;
    const email = formElements.email.value;
    const password = formElements.password.value;
    const name = formElements.name.value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      //const user = userCredential.user;
      fetch(`${dbUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user: null,
          name: name,
          email: email,
        }),
      });
      navigate("/billy/login");
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      alert("Error al registrar el usuario. Por favor, inténtelo de nuevo.");
    }
  };

  return (
    <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s",
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "background.level1",
            backgroundImage: "url(/billy_logo.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "50vw" },
              px: 2,
              maxWidth: 500,
            }}
          >
            <Box
              component="header"
              sx={{
                py: 3,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
                <IconButton variant="soft" color="primary" size="sm">
                  <BadgeRoundedIcon />
                </IconButton>
                <Typography level="title-lg">Billy</Typography>
              </Box>
            </Box>
            <Box
              component="main"
              sx={{
                py: 2,
                pb: 5,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Stack gap={4} sx={{ mb: 2 }}>
                <Stack gap={1}>
                  <Typography component="h1" level="h3">
                    Sign up
                  </Typography>
                </Stack>
              </Stack>
              <Divider />
              <Stack gap={4} sx={{ mt: 2 }}>
                <form onSubmit={handleSubmit}>
                  <FormControl required>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" name="email" />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Name</FormLabel>
                    <Input type="name" name="name" />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Last name</FormLabel>
                    <Input type="lastName" name="lastName" />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" name="password" />
                  </FormControl>
                  <Stack gap={4} sx={{ mt: 2 }}>
                    <Button type="submit" fullWidth>
                      Sign up
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Box>
            <Box component="footer" sx={{ py: 3 }}>
              <Typography level="body-xs" textAlign="center">
                © Billy {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
