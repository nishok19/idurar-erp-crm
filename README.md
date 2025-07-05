## Query Management Feature Implementation

### Demo Video

<video width="100%" controls>
  <source src="demo-query.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

The Query Management feature has been implemented as a comprehensive customer support system with both backend API routes and frontend components.

### Backend Implementation

#### 1. Database Model (`backend/src/models/appModels/Query.js`)

```javascript
const QuerySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    client: { type: String },
    description: { type: String },
    resolution: { type: String },
    notes: [NoteSchema], // Array of notes with noteId, text, and timestamp
  },
  { timestamps: true }
);
```

#### 2. API Routes (`backend/src/routes/appRoutes/queryApi.js`)

The following RESTful endpoints are implemented:

- `GET /api/queries/list` - List all queries with pagination
- `GET /api/queries/:id` - Get specific query details
- `POST /api/queries` - Create new query
- `PATCH /api/queries/:id` - Update query status and resolution
- `POST /api/queries/:id/notes` - Add note to query
- `DELETE /api/queries/:id/notes/:noteId` - Delete specific note

#### 3. Controller (`backend/src/controllers/appControllers/queryController.js`)

Implements all CRUD operations with:

- Pagination support for listing queries
- Status management (open, in_progress, resolved, closed)
- Notes management with UUID-based note identification
- Client association and resolution tracking

#### 4. Route Integration (`backend/src/app.js`)

```javascript
const queryApiRouter = require("./routes/appRoutes/queryApi");
app.use("/api", adminAuth.isValidAuthToken, queryApiRouter);
```

### Frontend Implementation

#### 1. Query List Component (`frontend/src/pages/Query/index.jsx`)

- **DataTable Integration**: Uses the existing DataTable component with custom columns
- **Status Filtering**: Dropdown filter for query status
- **Client Association**: Displays client names by fetching client data
- **Custom API Calls**: Implements custom fetch function for queries
- **Redux Integration**: Uses existing CRUD actions with entity-specific handling

#### 2. Query Form (`frontend/src/forms/QueryForm.jsx`)

- **Client Selection**: Dropdown populated with existing clients
- **Status Management**: Predefined status options
- **Form Validation**: Required field validation
- **Redux Actions**: Integrates with CRUD create/update actions

#### 3. Query Detail View (`frontend/src/pages/Query/ReadQuery.jsx`)

- **Query Information**: Displays all query details using Ant Design Descriptions
- **Notes Management**: Integrates with Notes component for adding/deleting notes
- **Direct API Calls**: Uses request utility for note operations

#### 4. Redux Configuration

**Actions (`frontend/src/redux/crud/actions.js`)**:

```javascript
// Special handling for query datatype
if (data?.datatype == "query") {
  dispatch({
    type: actionTypes.REQUEST_SUCCESS,
    keyState: "queries",
    payload: result,
  });
}
```

**Selectors (`frontend/src/redux/crud/selectors.js`)**:

```javascript
export const selectQueryItems = createSelector(
  [selectCrud],
  (crud) => crud.queries
);
```

#### 5. Routing Configuration (`frontend/src/router/routes.jsx`)

```javascript
{
  path: '/query',
  element: <Query />,
},
{
  path: '/query/create',
  element: <QueryForm />,
},
{
  path: '/query/:id',
  element: <ReadQuery />,
}
```

### Key Features Implemented

1. **Status Workflow**: Queries can be tracked through different statuses (open → in_progress → resolved → closed)
2. **Client Association**: Each query is linked to a specific client
3. **Notes System**: Support for adding and deleting notes on queries
4. **Pagination**: Efficient handling of large query lists
5. **Filtering**: Status-based filtering in the list view
6. **Responsive Design**: Uses Ant Design components for consistent UI
7. **Error Handling**: Comprehensive error handling for API calls
8. **Loading States**: Proper loading indicators for better UX

### API Endpoints Summary

| Method | Endpoint                         | Description                  |
| ------ | -------------------------------- | ---------------------------- |
| GET    | `/api/queries/list`              | List queries with pagination |
| GET    | `/api/queries/:id`               | Get specific query           |
| POST   | `/api/queries`                   | Create new query             |
| PATCH  | `/api/queries/:id`               | Update query                 |
| POST   | `/api/queries/:id/notes`         | Add note to query            |
| DELETE | `/api/queries/:id/notes/:noteId` | Delete note from query       |
