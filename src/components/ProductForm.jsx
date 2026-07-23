import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiCamera, FiImage, FiTrash2, FiRotateCcw, FiPlus, FiList, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getProducts } from '../services/api';

const DEFAULT_CATEGORIES = [
  'Electronics',
  'Accessories',
  'Clothing',
  'Groceries',
  'Hardware',
  'Home & Kitchen',
  'Health & Beauty'
];

const defaultValues = {
  name: '',
  category: '',
  price: '',
  quantity: '',
  description: ''
};

export default function ProductForm({ initialValues, onSubmit, loading, submitLabel = 'Save Product', requireImage = false }) {
  const [previewUrl, setPreviewUrl] = useState('');
  const [categoriesList, setCategoriesList] = useState(DEFAULT_CATEGORIES);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [showCameraModal, setShowCameraModal] = useState(false);

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const formDefaults = useMemo(
    () => ({
      ...defaultValues,
      ...initialValues
    }),
    [initialValues]
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({ defaultValues: formDefaults });

  register('category', { required: 'Category is required.' });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getProducts({ limit: 500 });
        const products = response.data || [];
        const extracted = products.map((p) => p.category).filter(Boolean);
        const combined = Array.from(new Set([...DEFAULT_CATEGORIES, ...extracted]));
        setCategoriesList(combined);

        const currentCat = initialValues?.category;
        if (currentCat) {
          if (combined.includes(currentCat)) {
            setValue('category', currentCat);
            setIsCustomCategory(false);
          } else {
            setIsCustomCategory(true);
            setCustomCategoryInput(currentCat);
            setValue('category', currentCat);
          }
        } else if (combined.length > 0) {
          setValue('category', combined[0]);
        }
      } catch {
        if (initialValues?.category) {
          setValue('category', initialValues.category);
        }
      }
    };

    loadCategories();
  }, [initialValues, setValue]);

  const currentCategoryValue = watch('category') || '';

  useEffect(() => {
    reset(formDefaults);
    setPreviewUrl(initialValues?.imagePreview || initialValues?.imageUrl || initialValues?.image || '');
  }, [formDefaults, initialValues, reset]);

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowed.includes(file.type)) {
        toast.error('Only JPG, JPEG, PNG, and WEBP images are allowed.');
        return;
      }
      setValue('image', files, { shouldValidate: true });
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      toast.success('Image selected!');
    }
  };

  const removeImage = () => {
    setValue('image', null, { shouldValidate: true });
    setPreviewUrl('');
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const openCamera = async () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile && cameraInputRef.current) {
      cameraInputRef.current.click();
      return;
    }

    try {
      setShowCameraModal(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setShowCameraModal(false);
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        toast.error('Unable to access camera device.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCameraModal(false);
  };

  const captureWebcamPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
          const container = new DataTransfer();
          container.items.add(file);
          const files = container.files;

          setValue('image', files, { shouldValidate: true });
          const objectUrl = URL.createObjectURL(file);
          setPreviewUrl(objectUrl);
          toast.success('Photo captured successfully!');
        }
        stopCamera();
      },
      'image/jpeg',
      0.9
    );
  };

  const submitHandler = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name || '');
    formData.append('category', values.category || '');
    formData.append('price', values.price || '0');
    formData.append('quantity', values.quantity || '0');
    formData.append('description', values.description || '');

    if (values.image?.[0]) {
      formData.append('image', values.image[0]);
    } else {
      formData.append('image', previewUrl || initialValues?.image || initialValues?.imageUrl || '');
    }

    await onSubmit(formData);
  };

  const onInvalid = (formErrors) => {
    const firstErrorMessage = Object.values(formErrors)[0]?.message;
    if (firstErrorMessage) {
      toast.error(firstErrorMessage);
    }
  };

  const clearForm = () => {
    reset(formDefaults);
    setPreviewUrl(initialValues?.imagePreview || initialValues?.imageUrl || initialValues?.image || '');
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    if (categoriesList.length > 0) {
      setValue('category', categoriesList[0]);
    }
  };

  return (
    <form className="surface space-y-5 p-4 sm:p-5" onSubmit={handleSubmit(submitHandler, onInvalid)}>
      {/* Hidden File Inputs */}
      <input
        ref={galleryInputRef}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        type="file"
        onChange={handleFileSelect}
      />
      <input
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        type="file"
        onChange={handleFileSelect}
      />

      {/* Image Picker Section */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Product preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700"
                  title="Remove Image"
                >
                  <FiX className="text-xs" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-slate-400">
                <FiImage className="text-3xl" />
                <span className="text-xs">No image</span>
              </div>
            )}
          </div>

          <div className="w-full space-y-2.5 text-center sm:text-left">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Product Photo</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Take a new photo with camera or pick from gallery.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <button
                type="button"
                className="btn-primary text-xs py-2 px-3 gap-1.5"
                onClick={openCamera}
              >
                <FiCamera className="text-sm" />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                className="btn-secondary text-xs py-2 px-3 gap-1.5"
                onClick={() => galleryInputRef.current?.click()}
              >
                <FiImage className="text-sm" />
                <span>Choose File</span>
              </button>

              {previewUrl ? (
                <button
                  type="button"
                  className="btn-danger text-xs py-2 px-2.5"
                  onClick={removeImage}
                >
                  <FiTrash2 className="text-xs" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Form Inputs Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Product Name *
          </label>
          <input className="input-shell" {...register('name', { required: 'Product name is required.' })} placeholder="e.g. Wireless Headphones" />
          {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Category *
            </label>
            {!isCustomCategory ? (
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                onClick={() => {
                  setIsCustomCategory(true);
                  setValue('category', customCategoryInput || '', { shouldValidate: true });
                }}
              >
                <FiPlus /> Add New Category
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:underline dark:text-slate-400"
                onClick={() => {
                  setIsCustomCategory(false);
                  if (categoriesList.length > 0) {
                    setValue('category', categoriesList[0], { shouldValidate: true });
                  }
                }}
              >
                <FiList /> Select from Dropdown
              </button>
            )}
          </div>

          {!isCustomCategory ? (
            <select
              className="input-shell cursor-pointer text-sm"
              value={categoriesList.includes(currentCategoryValue) ? currentCategoryValue : ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '__ADD_NEW__') {
                  setIsCustomCategory(true);
                  setValue('category', '', { shouldValidate: true });
                } else {
                  setValue('category', val, { shouldValidate: true });
                }
              }}
            >
              <option value="" disabled>Select a category...</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__ADD_NEW__" className="font-bold text-indigo-600">
                + Add New Category...
              </option>
            </select>
          ) : (
            <div className="space-y-1.5">
              <input
                className="input-shell"
                placeholder="Enter new category name..."
                value={currentCategoryValue}
                onChange={(e) => {
                  setCustomCategoryInput(e.target.value);
                  setValue('category', e.target.value, { shouldValidate: true });
                }}
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Type custom category name above.
              </p>
            </div>
          )}
          {errors.category ? <p className="mt-1 text-xs text-rose-600">{errors.category.message}</p> : null}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Price ($) *
          </label>
          <input
            className="input-shell"
            min="0"
            step="0.01"
            type="number"
            {...register('price', {
              required: 'Price is required.',
              min: { value: 0, message: 'Price must be 0 or greater.' }
            })}
            placeholder="0.00"
          />
          {errors.price ? <p className="mt-1 text-xs text-rose-600">{errors.price.message}</p> : null}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Quantity *
          </label>
          <input
            className="input-shell"
            min="0"
            step="1"
            type="number"
            {...register('quantity', {
              required: 'Quantity is required.',
              min: { value: 0, message: 'Quantity must be 0 or greater.' }
            })}
            placeholder="0"
          />
          {errors.quantity ? <p className="mt-1 text-xs text-rose-600">{errors.quantity.message}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Description
          </label>
          <textarea className="input-shell min-h-24 text-sm" {...register('description')} placeholder="Product specifications or notes..." />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button className="btn-primary flex-1 py-3 text-sm" disabled={loading} type="submit">
          {loading ? 'Saving...' : submitLabel}
        </button>
        <button className="btn-secondary py-3 text-sm px-4" onClick={clearForm} type="button">
          <FiRotateCcw /> Reset
        </button>
      </div>

      {/* Camera Web Viewfinder Modal for Desktop / Browser Fallback */}
      {showCameraModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative flex w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <FiCamera className="text-indigo-400" /> Camera Viewfinder
              </h3>
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white"
              >
                <FiX className="text-base" />
              </button>
            </div>

            <div className="relative aspect-square w-full overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between gap-3 p-4">
              <button
                type="button"
                onClick={stopCamera}
                className="btn-secondary text-xs flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={captureWebcamPhoto}
                className="btn-primary text-xs flex-1 gap-1.5"
              >
                <FiCheck className="text-sm" />
                <span>Snap Photo</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
