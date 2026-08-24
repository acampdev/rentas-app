import { Description, PhotoCamera } from "@mui/icons-material";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";

interface Props {
  images: File[];
  setImages: Dispatch<SetStateAction<File[]>>;
  loading: boolean;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const PredioImages = ({
  images,
  setImages,
  loading,
  onUpload,
}: Props) => (
  <Box>
    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
      Imágenes
    </Typography>
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button
        variant="outlined"
        component="label"
        disabled={loading}
        startIcon={<PhotoCamera />}
        sx={uploadButtonSx}
      >
        Foto
        <input
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={onUpload}
        />
      </Button>
      <Button
        variant="outlined"
        component="label"
        disabled={loading}
        startIcon={<Description />}
        sx={uploadButtonSx}
      >
        Plano
        <input type="file" hidden multiple onChange={onUpload} />
      </Button>
    </Box>
    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
      {images.map((file, index) => (
        <Chip
          key={`${file.name}-${index}`}
          label={file.name}
          onDelete={() =>
            setImages((current) =>
              current.filter((_, itemIndex) => itemIndex !== index),
            )
          }
          size="small"
        />
      ))}
    </Stack>
  </Box>
);

const uploadButtonSx = {
  width: 120,
  height: 40,
  textTransform: "none",
  borderRadius: 1.5,
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  '& input[type="file"]': { display: "none !important" },
};
