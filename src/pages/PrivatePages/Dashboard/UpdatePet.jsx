import React from 'react';
import { motion } from 'framer-motion';
import { useLoaderData } from 'react-router-dom';
import SectionTitle from '@/components/SectionTitle/SectionTitle';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { Formik } from 'formik';
import Select from 'react-select'
import Swal from "sweetalert2";


const UpdatePet = () => {
    const { image, name, age, category, location, shortDescription, longDescription, _id} = useLoaderData();
    // console.log(pets);

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_API = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
const axiosPublic = useAxiosPublic();
const axiosSecure = useAxiosSecure();

    const petCategories = [
        { value: 'dog', label: 'Dog' },
        { value: 'cat', label: 'Cat' },
        { value: 'bird', label: 'Bird' },
        { value: 'rabbit', label: 'Rabbit'},
        { value: 'fish', label: 'Fish' },
        { value: 'other', label: 'Other' },
      ]
    return (
        <div>
            <SectionTitle
            title={"Update a Pet Info"}
            ></SectionTitle>

<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="max-w-4xl mx-auto p-10 bg-card border border-border shadow-lg shadow-primary/10 rounded-2xl"
>
        <Formik
          initialValues={{
            image: image,
            name: name,
            age: age,
            category: category,
            location: location,
            shortDescription: shortDescription,
            longDescription: longDescription,
          }}

          // -----errors handling-----
          
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "Pet name is required";
            }
            if (!values.age) {
              errors.age = "Pet age is required";
            }
            if (!values.category) {
              errors.category = "Pet category is required";
            }
            if (!values.location) {
              errors.location = "Location is required";
            }
            // if(values.shortDescription.length > 30){
            //   errors.shortDescription = "Your note is too long! Please shorten it to at least 30 characters!";
            // }else if(values.shortDescription.length < 30){
            //   errors.shortDescription = "Your note is too short! Please write at least 30 characters!";
            // }
            return errors;
          }}

          onSubmit= {async (values, { resetForm }) => {

                const formData = new FormData();
                formData.append('image', values.image);

                const res = await axiosPublic.post(image_hosting_API, formData, {
                    headers:{
                        'content-type': 'multipart/form-data'
                    }
                });
                // console.log(res.data);

            if(res.data.success){
              const petData = {
                image: res.data.data.url,
                name: values.name,
                age: values.age,
                category: values.category,
                location: values.location,
                "short description": values.shortDescription,
                "long description": values.longDescription,
                "date and time": new Date(res.data.data.time * 1000).toLocaleString(),
                 adopted: "false"

              }

              const pets = await axiosSecure.patch(`/pets/${_id}`, petData);
              // console.log(pets.data);
              resetForm();
              if(pets.data.modifiedCount>0){
                Swal.fire(`Your ${values.name}'s information has been updated successfully!`);
              }
            }
          }}
        >

          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => (

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="text-sm font-medium text-foreground/80">
                  Pet Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange=
                  {(e)=> setFieldValue('image', e.target.files[0])}
                  className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow"
                />
                {values.image && (
                  <p className="text-sm text-emerald-500 mt-2">
                    Image selected: {values.image.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder="Enter pet name"
                  className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow"
                />
                {errors.name && touched.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>
  
              <div>
                <label className="text-sm font-medium text-foreground/80">
                  Age
                </label>
                <input
                  type="text"
                  name="age"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.age}
                  placeholder="Enter pet age"
                  className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow"
                />
                {errors.age && touched.age && (
                  <p className="text-sm text-destructive mt-1">{errors.age}</p>
                )}
              </div>
    
              <div>
                <label className="text-sm font-medium text-foreground/80">
                Category
                </label>
                <Select
                  options={petCategories}
                  onChange={(selectedOption)=>setFieldValue("category", selectedOption?.value || "")}
                  onBlur={handleBlur}
                  className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow"
                >
                </Select>
                {errors.category && touched.category && (
                  <p className="text-sm text-destructive mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/80">
                Location
                </label>
                <input
                  type="text"
                  name="location"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.location}
                  placeholder="Enter location"
                  className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow"
                />
                {errors.location && touched.location && (
                  <p className="text-sm text-destructive mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/80">
                  Short Description
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.shortDescription}
                  placeholder="A short note about the pet"
                  className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow"
                />
                {errors.shortDescription && (
                  <p className="text-sm text-destructive mt-1">{errors.shortDescription}</p>
                )}
              </div>
    
              <div>
                <label className="text-sm font-medium text-foreground/80">
                  Long Description
                </label>
                <textarea
                  name="longDescription"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.longDescription}
                  placeholder="Detailed information about the pet"
                  className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg h-28 focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow"
                ></textarea>
              </div>
    
              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground p-3 rounded-lg shadow-md shadow-primary/30 transition-colors hover:bg-primary/90"
                >
                  Submit
                </motion.button>
              </div>
            </form>
          )}
        </Formik>
      </motion.div>
        </div>
    );
};

export default UpdatePet;