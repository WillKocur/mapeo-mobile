import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { StyleSheet, View } from "react-native";
import { useBlurOnFulfill } from "react-native-confirmation-code-field";

import { PasscodeScreens } from ".";
import { KILL_PASSCODE } from "../../constants";
import { SecurityContext } from "../../context/SecurityContext";
import { useNavigationFromRoot } from "../../hooks/useNavigationWithTypes";

import { RED, WHITE } from "../../lib/styles";
import Button from "../../sharedComponents/Button";
import {
  CELL_COUNT,
  PasscodeInput,
} from "../../sharedComponents/PasscodeInput";
import Text from "../../sharedComponents/Text";

const m = defineMessages({
  titleSet: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.TitleSet",
    defaultMessage: "Set App Passcode",
  },
  initialPassError: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.initialPassError",
    defaultMessage: "Password must be 5 numbers",
  },
  titleConfirm: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.TitleConfirm",
    defaultMessage: "Re-enter Passcode",
  },
  titleEnter: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.titleEnter",
    defaultMessage: "Enter Passcode",
  },
  subTitleSet: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.subTitleSet",
    defaultMessage: "This passcode will be used to open the Mapeo App",
  },
  subTitleConfirm: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.subTitleConfirm",
    defaultMessage: "Password",
  },
  subTitleEnter: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.subTitleEnter",
    defaultMessage: "Please Enter Password",
  },
  passwordDoesNotMatch: {
    id:
      "screens.AppPasscode.NewPasscode.InputPasscodeScreen.passwordDoesNotMatch",
    defaultMessage: "Password does not match",
  },
  passwordError: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.passwordError",
    defaultMessage: "Incorrect Password",
  },
  button: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.button",
    defaultMessage: "Next",
  },
  killPasscodeError: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.killPasscodeError",
    defaultMessage: "Cannot be used as a Passcode",
  },
});

interface SetPasscodeProps {
  screenState: PasscodeScreens;
  setScreenState: React.Dispatch<React.SetStateAction<PasscodeScreens>>;
}

/** This screen is used when the user is setting a password, confiriming their password, and will be used when the user is entering their password to enter the app */

export const InputPasscodeScreen = ({
  screenState,
  setScreenState,
}: SetPasscodeProps) => {
  const [error, setError] = React.useState(false);
  const initialPassword = React.useRef("");
  const [{ passcode }, setAuthState] = React.useContext(SecurityContext);
  const { navigate } = useNavigationFromRoot();
  const [inputtedPass, setInputtedPass] = React.useState("");
  const isKillPasscode = React.useRef(false);
  const inputRef = useBlurOnFulfill({
    value: inputtedPass,
    cellCount: CELL_COUNT,
  });
  //This checks that the user cannot be in the confirm passcode screen if they have not typed in an initial passcode
  React.useEffect(() => {
    if (screenState === "confirmSetPasscode" && !initialPassword.current) {
      setScreenState("intro");
    }
  }, [screenState]);

  React.useEffect(() => {
    if (inputtedPass.length > 0) setError(false);
  }, [inputtedPass]);

  const [title, subtitle, errorMessage] = React.useMemo(() => {
    if (screenState === "setPasscode") {
      if (isKillPasscode.current)
        return [m.titleSet, m.subTitleSet, m.killPasscodeError];
      return [m.titleSet, m.subTitleSet, m.initialPassError];
    }

    if (screenState === "confirmSetPasscode") {
      return [m.titleConfirm, m.subTitleConfirm, m.passwordDoesNotMatch];
    }

    return [m.titleEnter, m.subTitleEnter, m.passwordError];
  }, [screenState, isKillPasscode.current]);

  function validateAndSetScreen(screen: PasscodeScreens) {
    if (inputtedPass.length !== CELL_COUNT) {
      setError(true);
      return;
    }

    switch (screen) {
      case "enterPasscode":
        if (inputtedPass === passcode) {
          setScreenState("disablePasscode");
          return;
        }
        setError(true);
        break;
      case "setPasscode":
        if (inputtedPass === KILL_PASSCODE) {
          isKillPasscode.current = true;
          setError(true);
          return;
        }
        initialPassword.current = inputtedPass;
        setInputtedPass("");
        setScreenState("confirmSetPasscode");
        inputRef.current?.focus();
        return;
      case "confirmSetPasscode":
        if (inputtedPass === initialPassword.current) {
          setAuthState({
            type: "setPasscode",
            newPasscode: initialPassword.current,
          });
          navigate("Security");
          return;
        }
      default:
        setError(true);
    }
  }

  return (
    <React.Fragment>
      <View style={[styles.container]}>
        <Text style={[styles.header]}>
          <FormattedMessage {...title} />
        </Text>
        <Text style={[styles.subtext]}>
          <FormattedMessage {...subtitle} />
        </Text>

        <PasscodeInput
          ref={inputRef}
          inputValue={inputtedPass}
          onChangeTextWithValidation={setInputtedPass}
          maskValues={
            !(
              screenState === "confirmSetPasscode" ||
              screenState === "setPasscode"
            )
          }
        />

        {error && (
          <Text style={styles.error}>
            <FormattedMessage {...errorMessage} />
          </Text>
        )}
      </View>

      <Button fullWidth onPress={() => validateAndSetScreen(screenState)}>
        <Text style={styles.buttonText}>
          <FormattedMessage {...m.button} />
        </Text>
      </Button>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: WHITE,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    width: "100%",
    minWidth: 90,
    maxWidth: 280,
  },
  header: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: "center",
  },
  subtext: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
  },
  container: {
    padding: 20,
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
  },
  error: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    marginTop: 20,
    color: RED,
  },
});
