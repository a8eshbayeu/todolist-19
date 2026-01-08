import { selectThemeMode, setIsLoggedInAC } from "@/app/app-slice"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { useLazyGetCaptchaQuery, useLoginMutation } from "@/features/auth/api/authApi"
import { type LoginInputs, loginSchema } from "@/features/auth/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import styles from "./Login.module.css"
import { useEffect, useState } from "react"

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()
  const theme = getTheme(themeMode)

  const [login] = useLoginMutation()
  const [getCaptcha] = useLazyGetCaptchaQuery()

  const [captchaUrl, setCaptchaUrl] = useState<string | null>(null)
  const [isCaptchaLoading, setCaptchaLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors }
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false, captcha: "" }
  })

  const loadCaptcha = async () => {
    setCaptchaLoading(true)
    try {
      const res = await getCaptcha().unwrap()
      setCaptchaUrl(res.url)
    } catch (err) {
      console.error("Failed to fetch captcha:", err)
    } finally {
      setCaptchaLoading(false)
    }
  }

  useEffect(() => {
    loadCaptcha()
  }, [])

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const res = await login(data).unwrap()

      if (res.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }))
        localStorage.setItem(AUTH_TOKEN, res.data.token)
        reset({ email: "", password: "", rememberMe: false, captcha: "" })
        setCaptchaUrl(null)
      } else if (res.resultCode === ResultCode.CaptchaRequired) {
        setError("captcha", {
          type: "server",
          message: "Incorrect captcha. Please try again."
        })

        reset(
          {
            email: data.email,
            password: data.password,
            rememberMe: data.rememberMe,
            captcha: ""
          },
          { keepErrors: true }
        )
        setCaptchaUrl(res.captchaUrl!)
      }

    } catch (err) {
      console.error("Network or server error:", err)
    }
  }

  return (
    <Grid container justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>
            <p>
              To login get registered
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href="https://social-network.samuraijs.com"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>
              <b>Email:</b> free@samuraijs.com
            </p>
            <p>
              <b>Password:</b> free
            </p>
          </FormLabel>
          <FormGroup>
            <TextField label="Email" margin="normal" error={!!errors.email} {...register("email")} />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
            <TextField
              type="password"
              label="Password"
              margin="normal"
              error={!!errors.password}
              {...register("password")}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}

            {isCaptchaLoading && <p>Loading captcha...</p>}
            {captchaUrl && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={captchaUrl} alt="captcha" className={styles.captchaImage} />
                  <Button type="button" variant="outlined" onClick={loadCaptcha}>
                    Refresh captcha
                  </Button>
                </div>
                <TextField
                  label="Enter captcha"
                  margin="normal"
                  error={!!errors.captcha}
                  helperText={errors.captcha?.message}
                  {...register("captcha")}
                />
              </>
            )}

            <FormControlLabel
              label={"Remember me"}
              control={
                <Controller
                  name={"rememberMe"}
                  control={control}
                  render={({ field: { value, ...field } }) => <Checkbox {...field} checked={value} />}
                />
              }
            />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}
