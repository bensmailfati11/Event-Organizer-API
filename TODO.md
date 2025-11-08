# TODO: Clean Master and Create Handlebars Branch

## On Master Branch (Pure Backend API)

- [ ] Remove express-handlebars from package.json
- [ ] Update src/main.js to remove Handlebars view engine setup
- [ ] Update src/routes/index.js to remove web routes (keep only API routes under /api)
- [ ] Run npm install to update dependencies

## Create and Setup Handlebars Branch

- [ ] Create new branch "handlebars"
- [ ] Switch to handlebars branch
- [ ] Add express-handlebars back to package.json
- [ ] Update src/main.js to add Handlebars view engine setup
- [ ] Update src/routes/index.js to add web routes for rendering views
- [ ] Create src/views directory and handlebars files:
  - [ ] layouts/main.handlebars
  - [ ] home.handlebars
  - [ ] auth.handlebars
  - [ ] events.handlebars
  - [ ] dashboard.handlebars
  - [ ] backend-info.handlebars
- [ ] Run npm install on handlebars branch
- [ ] Test server on both branches
