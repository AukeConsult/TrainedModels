import express, { Application } from "express";
import Routes from './routes'
const app: Application = express();
const PORT: number = 3001
import authConfig from '../../auth_config.json';

if (
    !authConfig.domain ||
    !authConfig.authorizationParams.audience ||
    authConfig.authorizationParams.audience === "YOUR_API_IDENTIFIER"
) {
    console.log(
        "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
    );
    process.exit();
}

app.listen(PORT, "localhost", function () {

    new Routes(app)
    console.log(`Server is running on port ${PORT}.`);

}).on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });
