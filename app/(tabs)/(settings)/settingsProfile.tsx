import { useApolloClient } from "@apollo/client";
import ImageUploadArea from "@components/ImageUploadArea";
import MainButton from "@components/MainButton";
import SuspenseFallback from "@components/SuspenseFallback";
import MyToast from "@components/Toast";
import { API_KEY_GOOGLE } from "@env";
import { Box } from "@gluestack-ui/config/build/theme";
import {
  EditIcon,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  HStack,
  Input,
  InputField,
  Text,
  View,
  useToast,
  Pressable,
  CheckCircleIcon,
  Textarea,
  TextareaInput,
} from "@gluestack-ui/themed";
import { getProfileByAddress, setOrModifyProfile } from "@services/supabase";
import { useAddress } from "@thirdweb-dev/react-native";
import { Profile } from "@utils/types";
import { pickImage, uploadImage } from "@utils/uploading";
import * as ImagePicker from "expo-image-picker";
import React, { Suspense, useEffect, useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import invariant from "tiny-invariant";
import { boolean } from "ts-pattern/dist/patterns";

export default function Organization() {
  const client = useApolloClient();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const [description, setDescription] = useState("");
  const [locationCoords, setLocationCoords] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>();
  const toast = useToast();
  const address = useAddress();
  const [isEditing, setEditing] = useState({
    location: false,
    title: false,
    description: false,
    image: false,
  });

  useEffect(() => {
    if (!address) return;
    (async () => {
      const p = await getProfileByAddress(address);
      setProfile(p);
    })();
  }, [address]);

  async function handleImageUpload() {
    try {
      const image = await pickImage();
      invariant(image, "no image choosen");
      setImage(image);
    } catch (err) {
      console.error(err);
    }
  }

  async function submit() {
    try {
      invariant(address, "No Address");
      setLoading(true);

      const updateObject: {
        title?: string;
        imageUrl?: string;
        description?: string;
        locationCoords?: string;
      } = {};

      if (title) updateObject.title = title;
      if (image?.base64) {
        const path = await uploadImage(image.base64, address);
        updateObject.imageUrl = path;
      }
      if (description) updateObject.description = description;
      if (locationCoords) updateObject.locationCoords = locationCoords;

      await setOrModifyProfile({
        address,
        ...updateObject,
      });

      toast.show({
        placement: "top",
        render() {
          return <MyToast />;
        },
      });
      client.cache.gc();

      // ... the rest of the original submit function
    } catch (err) {
      console.error("contract call failure", err);
    } finally {
      setLoading(false);
    }
  }

  const handleFieldSave = async (fieldName: string) => {
    try {
      setLoading(true);
      const updateObject = { address };
      if (fieldName === "title" && title) updateObject.title = title;
      if (fieldName === "description" && description)
        updateObject.description = description;
      if (fieldName === "location" && locationCoords)
        updateObject.locationCoords = locationCoords;

      // await setOrModifyProfile(updateObject);
      setProfile((prev) => ({ ...prev, ...updateObject }));
      setEditing((prev) => ({ ...prev, [fieldName]: false }));
    } catch (error) {
      console.error(`Error updating ${fieldName}`, error);
      toast.show({
        /* ... */
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <View height={"100%"} bg="$white" p="$4" gap={"$2"}>
        <View w="$full" alignItems="center">
          <ImageUploadArea
            img={image?.uri ?? profile?.image_url}
            onPress={handleImageUpload}
          />
        </View>
        <FormControlLabel>
          <FormControlLabelText>Location</FormControlLabelText>
        </FormControlLabel>

        <EditableField
          label="Title"
          isEditing={isEditing.title}
          value={title}
          onChange={setTitle}
          onSave={() => handleFieldSave("title")}
          profileValue={profile?.title}
          setEditing={setEditing}
        />

        <EditableField
          label="Description"
          isEditing={isEditing.description}
          value={description}
          onChange={setDescription}
          onSave={() => handleFieldSave("description")}
          profileValue={profile?.description}
          multiline
          setEditing={setEditing}
        />
        <GooglePlacesAutocomplete
          placeholder="Where you are based?"
          styles={{
            container: {
              flex: 0,
              zIndex: 99,
            },
            listView: {
              zIndex: 99,
            },
            textInput: {
              zIndex: 99,
              borderWidth: 2,
              borderColor: "#eaeaea",
              borderRadius: 20,
            },
          }}
          fetchDetails
          onPress={(data, details = null) => {
            setLocationCoords(
              `${details?.geometry.location.lat},${details?.geometry.location.lng}`
            );
          }}
          query={{
            key: API_KEY_GOOGLE,
            language: "en",
          }}
        />

        <MainButton mt="auto" loading={loading} onPress={submit}>
          Save
        </MainButton>
      </View>
    </Suspense>
  );
}

type EditableFieldProps = {
  label: string;
  isEditing: boolean;
  value: string;
  onChange: Function;
  onSave: Function;
  profileValue: string;
  multiline: boolean;
  setEditing: Function;
};

const EditableField = ({
  label,
  isEditing,
  value,
  onChange,
  onSave,
  profileValue,
  multiline = false,
  setEditing,
}: EditableFieldProps) => {
  return (
    <>
      <FormControlLabelText>{label}</FormControlLabelText>
      <HStack gap="$4" justifyContent="space-between" alignItems="center">
        {isEditing ? (
          <>
            <FormControl flex={1}>
              {multiline ? (
                <Textarea>
                  <TextareaInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={label}
                  />
                </Textarea>
              ) : (
                <Input
                  bg="$white"
                  borderRadius="$lg"
                  h="$12"
                  borderWidth="$1"
                  borderColor="$borderLight300"
                >
                  <InputField
                    value={value}
                    onChangeText={onChange}
                    placeholder={label}
                  />
                </Input>
              )}
            </FormControl>
            <Pressable onPress={onSave} p="$2" bg="$green500" rounded="$full">
              <CheckCircleIcon size="sm" color="white" />
            </Pressable>
          </>
        ) : (
          <>
            <Text>{profileValue || `No ${label.toLowerCase()}`}</Text>
            <Pressable
              onPress={() =>
                setEditing((prev) => ({ ...prev, [label.toLowerCase()]: true }))
              }
              p="$2"
              bg="$blue500"
              rounded="$full"
            >
              <EditIcon size="sm" color="white" />
            </Pressable>
          </>
        )}
      </HStack>
    </>
  );
};
