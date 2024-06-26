import { HStack } from "@gluestack-ui/themed";
import { NWSymbolView } from "@lib/components/nativeWindInterop";
import { Button } from "@lib/components/ui/button";
import { Switch } from "@lib/components/ui/switch";
import * as Typo from "@lib/components/ui/typography";
import { NAV_THEME } from "@lib/constants";
import { useColorScheme } from "@lib/useColorScheme";
import { useLogout } from "@thirdweb-dev/react-native";
import * as Application from "expo-application";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
export default () => {
  const { logout } = useLogout();
  const { setColorScheme, isDarkColorScheme } = useColorScheme();
  const theme = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
  return (
    <View className="bg-background flex-1">
      <View>
        <Item
          title="Your Profile"
          onPress={() => router.push("/settingsProfile")}
        />
        <Item title="Dark Theme">
          <Switch
            checked={isDarkColorScheme}
            onCheckedChange={() =>
              setColorScheme(isDarkColorScheme ? "light" : "dark")
            }
          />
        </Item>
      </View>
      <View className="mt-auto items-center">
        <Button
          variant="outline"
          className="rounded-full w-[70%] border-secondary overflow-visible"
          //   @ts-ignore
          onPress={logout}
        >
          <Typo.Lead className="color-secondary pb-4">Logout</Typo.Lead>
        </Button>
        <Typo.Muted>Version: {Application.nativeApplicationVersion}</Typo.Muted>
        <Typo.Small>build: {Application.nativeBuildVersion} </Typo.Small>
      </View>
    </View>
  );

  function Item({ title = "", onPress = () => {}, children = null as any }) {
    return (
      <Pressable
        className="px-2 py-4 border-b-hairline border-secondary"
        onPress={onPress}
      >
        <HStack
          borderBottomColor="$trueGray700"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typo.H4>{title}</Typo.H4>
          {children ?? (
            <NWSymbolView
              tintColor={theme.secondary}
              name="chevron.right.circle.fill"
            />
          )}
        </HStack>
      </Pressable>
    );
  }
};
