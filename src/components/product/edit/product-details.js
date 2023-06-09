import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import FileUploaderSingle from "./upload-images";
import DropzoneWrapper from "../styles/index";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

const UPDATE_PRODUCT = gql`
mutation UpdateProduct($updateProductId: ID!, $input: UpdateProductInput, $files: [Upload]) {
  updateProduct(id: $updateProductId, input: $input, files: $files) {
    _id
    name
    productSKU
    productCode
    description
    price
    shortDescription
    stock
    images {
      id
      url
      image_name
    }
    categories {
      _id
      category_name
    }
  }
}`
const ProductDetails = ({ isEdited, setIsEdited, productDetail }) => {
  const [values, setValues] = useState({
    name: productDetail.name,
    code: productDetail.productCode,
    categories: productDetail.categories,
    price: productDetail.price,
    productSKU: productDetail.productSKU,
    description: productDetail.description,
    shortDescription: productDetail.shortDescription,
    additionalInfos: productDetail.additionalInfos,
    images: productDetail.images,
  });

  const [images, setImages] = useState([]);

  const link = createUploadLink({ uri: "https://thesis-backend-production-99f6.up.railway.app/graphql" })
  const [updateProduct, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_PRODUCT, {
    client: new ApolloClient({
      link,
      cache: new InMemoryCache(),
    })
  })
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const navigateToPageAndRefresh = (targetPage) => {
    // Navigate to the target page
    Router.push(targetPage);

    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 10);
  };
  const handleSaveChanges = async () => {
    const cates = [Buffer.from(values.categories)];
    const cateIds = cates.map(cate => cate.toString());
    const body = {
      name: values.name,
      productCode: values.code,
      productSKU: values.productSKU,
      categories: values.categories._id,
      price: Number(values.price),
      description: values.description,
      shortDescription: values.shortDescription,
      additionalInfos: values.additionalInfos,
    }

    try {
      const { data } = await updateProduct({
        variables: {
          updateProductId: productDetail._id,
          input: body,
          files: images,
        },
      })

      window.location.href = "/products";
    } catch (error) {
      console.error('Error create product:', error.message);
    }
  };

  const handleSwapMode = () => {
    setIsEdited(!isEdited);
  };

  return (
    <form autoComplete="off" noValidate>
      <Card>
        <CardHeader title="Product Detail" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: !isEdited,
                }}
                fullWidth
                label="Name"
                name="name"
                onChange={handleChange}
                value={values.name}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: !isEdited,
                  startAdornment: <Typography>$</Typography>,
                }}
                fullWidth
                label="Price"
                name="price"
                onChange={handleChange}
                value={values.price}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: !isEdited,
                }}
                fullWidth
                label="Code"
                name="code"
                onChange={handleChange}
                value={values.code}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: !isEdited,
                }}
                fullWidth
                label="SKU"
                name="productSKU"
                onChange={handleChange}
                value={values.productSKU}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                InputProps={{
                  readOnly: !isEdited,
                }}
                fullWidth
                label="Description"
                name="description"
                onChange={handleChange}
                value={values.description}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                InputProps={{
                  readOnly: !isEdited,
                }}
                fullWidth
                label="Short Description"
                name="shortDescription"
                onChange={handleChange}
                value={values.shortDescription}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                InputProps={{
                  readOnly: !isEdited,
                }}
                fullWidth
                label="Additional Info"
                name="additionalInfos"
                onChange={handleChange}
                value={values.additionalInfos}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography variant="body2" color="#65748B" sx={{ mb: 1 }}>
                Images
              </Typography>
              <DropzoneWrapper>
                <FileUploaderSingle
                  image={{
                    name: values.images.length !== 0 ? values.images[0].image_name : "no image",
                    url:
                      values.images.length !== 0
                        ? values.images[0].url
                        : "/static/images/no-image.png",
                  }}
                  isEdited={isEdited}
                  isHaveImage={values.images.length !== 0}
                  setImages={setImages}
                />
              </DropzoneWrapper>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        {isEdited ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
            }}
          >
            <Button color="primary" variant="contained" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
            }}
          >
            <Button color="primary" variant="contained" onClick={handleSwapMode}>
              Edit product
            </Button>
          </Box>
        )}
      </Card>
    </form>
  );
};

export default ProductDetails;
