import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function ClientPost() {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    price: '',
    image1: null,
    image2: null,
    image3: null
  });
  const [previews, setPreviews] = useState({
    image1: null,
    image2: null,
    image3: null
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    if (e.target.name.startsWith('image')) {
      const file = e.target.files[0];
      setFormData({ ...formData, [e.target.name]: file });
      setPreviews({ ...previews, [e.target.name]: URL.createObjectURL(file) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('type', formData.type);
    data.append('description', formData.description);
    data.append('price', formData.price);
    if (formData.image1) data.append('images', formData.image1);
    if (formData.image2) data.append('images', formData.image2);
    if (formData.image3) data.append('images', formData.image3);

    // Validation checks
    if (!formData.type || !formData.description || !formData.price || isNaN(formData.price)) {
      setMessage('Please fill out all fields correctly.');
      toast.error('Please fill out all fields correctly.', { duration: 4000, position: 'top-center' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:7000/api/posts', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setMessage('Post created successfully!');
      toast.success('Post created successfully!', { duration: 4000, position: 'top-center' });

      setFormData({ type: '', description: '', price: '', image1: null, image2: null, image3: null });
      setPreviews({ image1: null, image2: null, image3: null });
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error creating post: ' + error.message);
      toast.error('Error creating post: ' + error.message, { duration: 4000, position: 'top-center' });
    }
  };

  return (
    <div className="w-full h-[630px] overflow-y-auto px-4 pt-4">
      <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-2 flex gap-12">
        <div className="max-w-xl mx-48">
          <h1 className="text-2xl font-extrabold text-white text-center mb-2">Post Your Room, Apartment, or House For Rent</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300">Type</label>
              <select
                name="type"
                id="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-700 rounded-md shadow-sm py-2 px-3 bg-gray-800 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Room">Room</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full border border-gray-700 rounded-md shadow-sm py-2 px-3 bg-gray-800 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-700 rounded-md shadow-sm py-2 px-3 bg-gray-800 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((img) => (
                <div key={img} className="space-y-2">
                  <label htmlFor={`image${img}`} className="block text-sm font-medium text-gray-300">Image {img}</label>
                  <input
                    type="file"
                    id={`image${img}`}
                    name={`image${img}`}
                    onChange={handleChange}
                    accept="image/*"
                    className="sr-only"
                  />
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-2 cursor-pointer hover:border-indigo-500">
                    {previews[`image${img}`] ? (
                      <img src={previews[`image${img}`]} alt={`Preview ${img}`} className="h-32 w-full object-cover rounded" />
                    ) : (
                      <label htmlFor={`image${img}`} className="text-gray-400 text-sm text-center">Click to upload</label>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !formData.image1 && !formData.image2 && !formData.image3
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                Create Post
              </button>
            </div>
          </form>
          {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
        </div>
        {/* <div className=" w-1/4 h-96 bg-white bg-opacity-25 text-black p-6 rounded absolute z-10 right-16">
          <h1 className='text-center bg-red-950 text-white pt-2'>Notice! Notice!</h1>
          <h2 className='text-center bg-red-950 text-white py-2'>Read Carefully Before Creating Post!</h2>
          <ul className='p-2 mt-4 bg-red-200 bg-opacity-15 text-white'>
            <li>1. Please ensure all fields are filled correctly.</li>
            <li>2. Upload clear images for better visibility.</li>
            <li>3. Enter a valid price for your listing.</li>
            <li>4. Double-check your information before submitting.</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}

export default ClientPost;
