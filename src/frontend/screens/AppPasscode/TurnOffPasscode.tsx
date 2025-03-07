import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { TouchableOpacity } from "react-native-gesture-handler";

import { SecurityContext } from "../../context/SecurityContext";
import {
  List,
  ListDivider,
  ListItem,
  ListItemText,
} from "../../sharedComponents/List";
import { MEDIUM_GREY, RED } from "../../lib/styles";
import { PasscodeScreens } from ".";
import { useNavigationFromRoot } from "../../hooks/useNavigationWithTypes";
import { ErrorIcon } from "../../sharedComponents/icons";
import Button from "../../sharedComponents/Button";

const m = defineMessages({
  usePasscode: {
    id: "screens.AppPasscode.TurnOffPasscode.usePasscode",
    defaultMessage: "Use App Passcode",
  },
  changePasscode: {
    id: "screens.AppPasscode.TurnOffPasscode.changePasscode",
    defaultMessage: "Change App Passcode",
  },
  turnOffConfirmation: {
    id: "screens.AppPasscode.TurnOffPasscode.turnOffConfirmation",
    defaultMessage: "Turn Off App Passcode?",
  },
  turnOff: {
    id: "screens.AppPasscode.TurnOffPasscode.turnOff",
    defaultMessage: "Turn Off",
  },
  cancel: {
    id: "screens.AppPasscode.TurnOffPasscode.cancel",
    defaultMessage: "Cancel",
  },
  description: {
    id: "screens.AppPasscode.TurnOffPasscode.description",
    defaultMessage:
      "App Passcode adds an additional layer of security by requiring that you enter a passcode in order to open the Mapeo app.",
  },
  currentlyUsing: {
    id: "screens.AppPasscode.TurnOffPasscode.currentlyUsing",
    defaultMessage:
      "You are currently using App Passcode. See below to stop using or change your passcode.",
  },
});

interface TurnOffPasscodeProps {
  setScreenState: (screen: PasscodeScreens) => void;
}

export const TurnOffPasscode = ({ setScreenState }: TurnOffPasscodeProps) => {
  const { authValuesSet, setAuthValues } = React.useContext(SecurityContext);

  const sheetRef = React.useRef<BottomSheetMethods>(null);

  const { navigate } = useNavigationFromRoot();

  const { formatMessage: t } = useIntl();

  function unsetAppPasscode() {
    setAuthValues({ type: "passcode", value: null });
    navigate("Security");
  }

  function openBottomSheet() {
    sheetRef.current?.snapTo(1);
  }

  return (
    <React.Fragment>
      <Text style={styles.description}>{t(m.description)}</Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        {t(m.currentlyUsing)}
      </Text>
      <List>
        <ListItem style={styles.checkBoxContainer} onPress={openBottomSheet}>
          <ListItemText
            style={styles.text}
            primary={<FormattedMessage {...m.usePasscode} />}
          />
          <TouchableOpacity shouldActivateOnStart onPress={openBottomSheet}>
            <MaterialIcon
              name={
                authValuesSet.passcodeSet
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              size={24}
              color={MEDIUM_GREY}
            />
          </TouchableOpacity>
        </ListItem>
        <ListDivider />

        {/* User is not able to see this option unlesss they already have a pass */}
        {authValuesSet.passcodeSet && (
          <ListItem
            onPress={() => {
              setScreenState("setPasscode");
            }}
            style={{ marginTop: 20 }}
          >
            <ListItemText
              style={styles.text}
              primary={<FormattedMessage {...m.changePasscode} />}
            />
          </ListItem>
        )}
      </List>
      <ConfirmTurnOffPasswordModal
        turnOffPasscode={unsetAppPasscode}
        ref={sheetRef}
        closeSheet={() => {
          sheetRef.current?.close();
        }}
      />
    </React.Fragment>
  );
};

interface ConfirmTurnOffPasswordModal {
  turnOffPasscode: () => void;
  closeSheet: () => void;
}

const ConfirmTurnOffPasswordModal = React.forwardRef<
  BottomSheetMethods,
  ConfirmTurnOffPasswordModal
>(({ turnOffPasscode, closeSheet }, sheetRef) => {
  const [snapPoints, setSnapPoints] = React.useState<(number | string)[]>([
    0,
    "40%",
  ]);

  const { formatMessage: t } = useIntl();

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={BottomSheetBackdrop}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      handleHeight={0}
      handleComponent={() => null}
    >
      <View
        onLayout={e => {
          const { height } = e.nativeEvent.layout;
          setSnapPoints([0, height]);
        }}
        style={styles.btmSheetContainer}
      >
        <ErrorIcon style={{ position: "relative" }} size={90} color={RED} />
        <Text style={{ fontSize: 24, textAlign: "center", margin: 10 }}>
          {t(m.turnOffConfirmation)}
        </Text>
        <Button
          onPress={turnOffPasscode}
          fullWidth
          color="dark"
          style={{ backgroundColor: RED, marginTop: 30, marginBottom: 20 }}
        >
          {t(m.turnOff)}
        </Button>
        <Button onPress={closeSheet} fullWidth variant="outlined">
          {t(m.cancel)}
        </Button>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
  checkBoxContainer: {
    display: "flex",
    alignItems: "center",
  },
  btmSheetContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  description: {
    marginTop: 40,
    fontSize: 16,
    marginBottom: 20,
  },
});
