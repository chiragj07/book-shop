import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [imageToUpload, setimageToUpload] = useState('')
  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      history.push('/admin/productlist')
    } else {
      if (!product?.name || product?._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [dispatch, history, productId, product, successUpdate])


  const captureFile = async(event) => {
    event.preventDefault();
    console.log(event)
    const file = event.target.files[0];
    console.log(file)
    setimageToUpload(file)

    // };
  };

  const handleImageUpload = async (e)=>{
    if(!imageToUpload) {
      alert("please select an image")
      return
    }
    setUploading(true);

    // REACT_APP_CLOUDANARY_API_KEY
    const signature_cloudinary  = await axios.get(`${process.env.REACT_APP_BASE_URI}/api/products/get-signature`)
    console.log(signature_cloudinary.data)

    const data = new FormData()
    data.append("file", imageToUpload)
    data.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY)
    console.log(process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
    data.append("upload_preset",process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
    data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD)
    // data.append("signature", signature_cloudinary.data.signature)
    data.append("timestamp", signature_cloudinary.data.timestamp)

    
    try{
    const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD}/auto/upload`, data, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: function (e) {
      console.log(e.loaded / e.total)
    }
  })
  
  setImage(cloudinaryResponse.data.public_id)

  setUploading(false);
}
catch{
  setUploading(false);

}


  }
  const submitHandler = (e) => {
    e.preventDefault()
    console.log("called It Too")
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    )
  }

  

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer className="main-container-form">
        <h1>Edit Product</h1>
        {(loadingUpdate || uploading) && <div className="loader-class"><Loader/> </div>}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image' >
              <Form.Label>Image</Form.Label>
              <div className="image-class">
                
              <Form.File
                id='image-file'
                label='Choose File'
                custom
                onChange={captureFile}
              ></Form.File>
              <button type='button' variant='primary' id="image-btn" onClick={handleImageUpload}>
                Upload
              </button>
              </div>
            </Form.Group>
            <div style={{display:`${imageToUpload ? 'block':'none'}`, margin:"6px"}}>{imageToUpload && imageToUpload.name} </div>


            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen
