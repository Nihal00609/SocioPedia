import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
const host = process.env.REACT_APP_URL;

  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`${host}/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;