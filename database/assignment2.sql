-- Adding 'Tony Stark' account
INSERT INTO public.account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
  )
VALUES ('Tony',
 'Stark',
 'tony@starkent.com',
 'Iam1ronM@n'
 );

-- Update accoun type to 'Admin'
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete 'Tony Stark' account
DELETE FROM public.account
WHERE account_id = 1;

-- Update the "GM Hummer" record
UPDATE public.inventory
SET inv_description =
  REPLACE(inv_description,
  'the small interiors',
  'a huge interior')
WHERE inv_id = 10;

-- Join 'make', 'model', and 'classification name'
SELECT
    inv_make,
    inv_model,
    classification_name
FROM
    public.inventory
INNER JOIN public.classification
    ON public.inventory.classification_id = public.classification.classification_id
WHERE public.classification.classification_name = 'Sport';

-- Update all records images
UPDATE public.inventory
SET
  inv_image =
  REPLACE(inv_image,
  '/images',
  '/images/vehicles'),
  inv_thumbnail =
  REPLACE(inv_thumbnail,
  '/images',
  '/images/vehicles');