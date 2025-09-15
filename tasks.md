# TASK LIST

# RULES
Its now allowed to use type any or unknwon, we type everything safe or we create missing types.

We follow the same pattern form Features: Controller, Query/Command Handler. Using Vertical Slice.

When we implement a new endpoint in backend, we create a type in web/shared/types for the command and result.
then we create the api request in web/shared/api, then we create a query hook in web/shared/hooks.

You do not add anything else that specified.

You build backend by running dotnet build and fix all errors before moving on to implemenitng types, api calls, and hooks.

Each feature in BackendApi should have a corresponding file in /shared/api, shared/hooks and shared/types

Make sure to implement all features.

you check for typescript errors every time your done with a task before moving on.

Use Shadcn components.

Use existing reusable components instead of creating new ones, unless asked for.

Keep file sizes to a minimum and create reusable compoonents when possible.

When importing from shared, instead of ```typescript import xyz from "@shared/hooks"```, do ```typescript import xyz from "@shared``` same goes form types as well and api

Always use the resuable ErrorMessage.tsx component from components/ErrorMessage.tsx and components/LoadingSpinner.tsx instead of rewriting every time.



# Task 1

Lets start by implementing auth. We should be able to set public and protected routes. We are using httpOnly cookies. backend sets cookie.
We need to add middleware check that can handle:
check if tokens are available
check if tokens are valid (using jwt secret from .env, must be the same as used in backend)
check if token is about to expire
refresh token
redirect to login if not authenticated and refresh is not possible.


# Create general reusable components
Lets create components we can reuse through the application.

Lets start with ContentContainer. It takes children and ensures padding is consistent through the whole application. it has flex flex-col gap-4

# Setup sidebar
Lets implement a layout with sidebar. LEts use this one: npx shadcn@latest add sidebar-07 from shadcn.
this should only be displayed on protected routes, public routes should have its own layout.

# add public layout
Add a public layout and placeholder pages for "/", "/about", "/contact"

Then create a register page and a login page and integrate it wit the backend.


# Create restaurant
Lets make it possible to create a restaurant.
If the logged in user does not own or manage any restaurant, we want to guide them trhough a "onboarding" flow.
Step one in the onbording flow will be to create a location, as of now, we only support restaurant, but we will set up salon, hotels etc later. Add salon and hotel but oonly as a "Coming soon" that is not possible to select.


Step 2 is to create the acutal restaurant, we need to make it so that we catch the user id (from the authorized endpoint create restaurant, then we create a UserRestaurant with the user as owner)

first of all, lets create a component that uses SearchBusiness to get the neccessary data we need to create the restaurnt.

# Appstate
We need to have a "appstate" selected location, as of now we only support restaurants, but will be supporting more types in the future. if a user only manages (is owner, admin or editor) in one location, we set that one automatically when siging in, if not, we make them select. Figure out a smart way to handle this. also, make it possible to add more restaurants

# Website

A restaurant should be able to create a website. not drag n drop, prebuilt sections.

Lets start by creating website, pages and sections. We start with the HeroSection, in frontend, this should be possible in two variants:

1. Title, description and button to the left, image to the right.
2. Title, description and button in center, background image and with a overlay over.

After creating a website, user must create pages. Here, we give the user two choises:
1. Compose a website on their own using prebuilt sections.
2. Crate a page from a template (a template), if chosing this, the user only have to set props values.

A website also needs to have a subdomain, have a look at how its done in this project: /Users/vegardlokreim/SaaS/prosjektet but dont copy code from there, since this project has A LOOOT of messy code. Do ONLY have a look at how subdomain is set up.

# Current task
# Implement hospitality.

A hospitality (i.e a hotel or someting similar) can have rooms.
A website may belong to a hospitality (and not just only a restaurant).

Hospitalitys dont have menus like restauraunts, they have rooms. I have set up the enitites, dont add any data, but refactor all code neccessary to make it work.

Make it possible to create a Hospitality location, make it possible to create a website for the location as well. make it possible to select it as selected in appstate.

