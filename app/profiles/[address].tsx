import ReviewListItem from "@components/ReviewListItem";

import { HStack, Box, Divider, Text, VStack } from "@gluestack-ui/themed";
import SuspenseFallback from "@lib/components/SuspenseFallback";
import { trpc } from "@lib/utils/trpc";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { FlashList } from "@shopify/flash-list";
import { skipToken } from "@tanstack/react-query";
import { shortenAddress } from "@utils/index";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { Suspense, useMemo, useState } from "react";

// TODO: 1. Add date
// TODO: Add list with sections for date?
const ProfileScreen = () => {
  const { address } = useLocalSearchParams<{ address: string }>();
  const [profile] = trpc.getProfileByAddress.useSuspenseQuery({
    address: address,
  });

  const [reviews] = trpc.attestations.useSuspenseQuery({
    recipients: [address],
  });

  const avgScore = useMemo(
    () =>
      reviews?.reduce((prev, curr, i) => {
        let accScore = prev + (curr?.data?.rating ?? 0);
        let l = i + 1;
        return l === reviews.length ? Math.round(accScore / l) : accScore;
      }, 0),
    [reviews]
  );

  return (
    <Box bgColor="$white" flex={1}>
      <Suspense fallback={<SuspenseFallback />}>
        <FlashList
          ListHeaderComponent={
            <ListHeader {...{ profile, avgScore, address }} />
          }
          estimatedItemSize={88}
          data={reviews}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Box p="$2">
              <ReviewListItem
                avatarUri={item?.attester?.image_url}
                userName={item?.attester?.title ?? item.attester}
                rating={item?.data?.rating}
                comment={item?.data?.comment}
              />
            </Box>
          )}
        />
      </Suspense>
    </Box>
  );
};

export default ProfileScreen;

const ListHeader = React.memo(({ profile, address, avgScore }: any) => (
  <>
    <Image
      style={{
        aspectRatio: 1.5 / 1,
        width: "100%",
        backgroundColor: "#0553",
      }}
      source={{
        uri: profile?.image_url ?? "",
      }}
      contentFit="cover"
    />
    <VStack gap={"$2"} pt="$6" px="$2" flex={1}>
      <Text color="$textLight950" bold size="2xl">
        {profile?.title}
      </Text>
      <Text color="$purple500">{shortenAddress(address)}</Text>
      <Text>{profile?.description}</Text>
      <Divider />
      <Text bold size="xl">
        Reviews
      </Text>
      <HStack alignItems="center" gap="$4">
        <Box
          padding="$2"
          rounded="$full"
          borderColor="$purple500"
          borderWidth="$1"
          bg="$purple200"
          aspectRatio="1"
          alignItems="center"
          justifyContent="center"
        >
          <Text size="2xl">
            {avgScore ? ["😔", "😐", "😊", "😃", "🤩"][avgScore] : "🤷‍♂️"}
          </Text>
        </Box>
        <Text underline size="lg">
          Avg score
        </Text>
      </HStack>
    </VStack>
  </>
));
