-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- owners
create table if not exists owners (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  age int check (age >= 0),
  gender text,
  about text,
  created_at timestamp default now()
);

-- dogs
create table if not exists dogs (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references owners(id) on delete cascade,
  name text,
  breed text,
  about text,
  age int check (age >= 0),
  weight int,
  sex int check (sex in (0,1)),             -- 1=Male, 0=Female
  neutered int check (neutered in (0,1)) default 0,
  sociability int check (sociability between 0 and 5),
  temperament int check (temperament between 0 and 5),
  created_at timestamp default now()
);

create index if not exists idx_dogs_owner on dogs(owner_id);

-- reviews
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  rating int check (rating between 1 and 5),
  dog_id uuid references dogs(id) on delete cascade,
  owner_id uuid references owners(id) on delete cascade,
  description text,
  created_at timestamp default now(),
  constraint unique_reviewer_per_dog unique (dog_id, owner_id)
);

create index if not exists idx_reviews_dog on reviews(dog_id);
create index if not exists idx_reviews_owner on reviews(owner_id);

-- breed
create table if not exists breed (
  id uuid primary key default uuid_generate_v4(),
  name text unique
);

-- Insert mock owners
INSERT INTO owners (name, email, age, gender, about) VALUES
('Sarah Johnson', 'sarah.j@email.com', 28, 'Female', 'Dog lover and outdoor enthusiast. Love hiking with my pup!'),
('Michael Chen', 'michael.chen@email.com', 35, 'Male', 'Software engineer who works from home. My dog is my best coworker!'),
('Emily Rodriguez', 'emily.r@email.com', 24, 'Female', 'Veterinary student passionate about animal care and training.'),
('James Wilson', 'james.w@email.com', 42, 'Male', 'Father of two kids who absolutely adore our family dog.'),
('Amanda Park', 'amanda.p@email.com', 31, 'Female', 'Yoga instructor seeking playmates for my energetic pup.'),
('David Martinez', 'david.m@email.com', 29, 'Male', 'Marathon runner looking for a running buddy for my dog.'),
('Jessica Lee', 'jessica.lee@email.com', 26, 'Female', 'Graphic designer who loves taking my dog to dog-friendly cafes.'),
('Robert Taylor', 'robert.t@email.com', 38, 'Male', 'Retired military, now focusing on dog training and socialization.'),
('Lisa Anderson', 'lisa.a@email.com', 33, 'Female', 'Teacher with summers off - perfect for dog park adventures!'),
('Kevin Brown', 'kevin.b@email.com', 27, 'Male', 'Photographer who loves capturing candid moments of dogs playing.');

-- Insert breeds
INSERT INTO breed (name) VALUES
('Golden Retriever'),
('Labrador Retriever'),
('German Shepherd'),
('Beagle'),
('Bulldog'),
('Poodle'),
('Corgi'),
('Husky'),
('Border Collie'),
('Australian Shepherd');

-- Insert mock dogs
INSERT INTO dogs (owner_id, name, breed, about, age, weight, sex, neutered, sociability, temperament)
SELECT 
  o.id,
  'Charlie',
  'Golden Retriever',
  'Friendly golden retriever who loves playing fetch and making new friends! Always up for park adventures.',
  3,
  70,
  1,
  1,
  5,
  5
FROM owners o WHERE o.email = 'sarah.j@email.com';

INSERT INTO dogs (owner_id, name, breed, about, age, weight, sex, neutered, sociability, temperament)
SELECT 
  o.id,
  'Luna',
  'Labrador Retriever',
  'Energetic and playful Lab who enjoys long walks and swimming. Looking for active playmates!',
  2,
  65,
  0,
  1,
  4,
  4
FROM owners o WHERE o.email = 'michael.chen@email.com';

INSERT INTO dogs (owner_id, name, breed, about, age, weight, sex, neutered, sociability, temperament)
SELECT 
  o.id,
  'Max',
  'German Shepherd',
  'Intelligent and protective shepherd. Great with kids and loves training sessions.',
  4,
  85,
  1,
  1,
  3,
  4
FROM owners o WHERE o.email = 'emily.r@email.com';

INSERT INTO dogs (owner_id, name, breed, about, age, weight, sex, neutered, sociability, temperament)
SELECT 
  o.id,
  'Bella',
  'Beagle',
  'Curious beagle with an amazing nose! Loves sniffing adventures and treat puzzles.',
  5,
  25,
  0,
  1,
  5,
  5
FROM owners o WHERE o.email = 'james.w@email.com';

INSERT INTO dogs (owner_id, name, breed, about, age, weight, sex, neutered, sociability, temperament)
SELECT 
  o.id,
  'Rocky',
  'Bulldog',
  'Laid-back bulldog who enjoys short walks and lots of naps. Perfect couch companion!',
  6,
  50,
  1,
  1,
  3,
  5
FROM owners o WHERE o.email = 'amanda.p@email.com';

INSERT INTO dogs (owner_id, name, breed, about, age, weight, sex, neutered, sociability, temperament)
SELECT 
  o.id,
  'Daisy',
  'Poodle',
  'Smart and elegant poodle who loves learning new tricks. Hypoallergenic and friendly!',
  3,
  45,
  0,
  1,
  4,
  4
FROM owners o WHERE o.email = 'david.m@email.com';

INSERT INTO dogs (owner_id, name, breed, about, age, weight, sex, neutered, sociability, temperament)
SELECT 
  o.id,
  'Cooper',
  'Corgi',
  'Sweet and gentle Corgi with a big personality! Loves treats and cuddling after playtime.',
  4,
  28,
  1,
  1,
  4,
  5
FROM owners o WHERE o.email = 'jessica.lee@email.com';

INSERT INTO dogs (owner_id, name, breed, about, age, weight, sex, neutered, sociability, temperament)
SELECT 
  o.id,
  'Zeus',
  'Husky',
  'High-energy husky who needs lots of exercise! Loves running and playing in the snow.',
  2,
  55,
  1,
  1,
  4,
  3
FROM owners o WHERE o.email = 'robert.t@email.com';

INSERT INTO dogs (owner_id, name, breed, about, age, weight, sex, neutered, sociability, temperament)
SELECT 
  o.id,
  'Sadie',
  'Border Collie',
  'Super smart border collie who excels at agility and frisbee. Always ready to play!',
  3,
  40,
  0,
  1,
  5,
  4
FROM owners o WHERE o.email = 'lisa.a@email.com';

INSERT INTO dogs (owner_id, name, breed, about, age, weight, sex, neutered, sociability, temperament)
SELECT 
  o.id,
  'Duke',
  'Australian Shepherd',
  'Loyal and active aussie who loves herding games. Great hiking companion!',
  5,
  60,
  1,
  1,
  4,
  4
FROM owners o WHERE o.email = 'kevin.b@email.com';

-- Insert some sample reviews
INSERT INTO reviews (rating, dog_id, owner_id, description)
SELECT 
  5,
  (SELECT id FROM dogs WHERE name = 'Luna'),
  (SELECT id FROM owners WHERE email = 'sarah.j@email.com'),
  'Luna and Charlie had an amazing playdate! They played fetch together for hours.'
WHERE EXISTS (SELECT 1 FROM dogs WHERE name = 'Luna');

INSERT INTO reviews (rating, dog_id, owner_id, description)
SELECT 
  4,
  (SELECT id FROM dogs WHERE name = 'Charlie'),
  (SELECT id FROM owners WHERE email = 'emily.r@email.com'),
  'Charlie is such a gentle and friendly dog. Max really enjoyed their time together!'
WHERE EXISTS (SELECT 1 FROM dogs WHERE name = 'Charlie');

INSERT INTO reviews (rating, dog_id, owner_id, description)
SELECT 
  5,
  (SELECT id FROM dogs WHERE name = 'Bella'),
  (SELECT id FROM owners WHERE email = 'amanda.p@email.com'),
  'Bella is absolutely adorable and so well-behaved! Rocky had a great time with her.'
WHERE EXISTS (SELECT 1 FROM dogs WHERE name = 'Bella');