# TODO List

### UI Design

* Generic style must be used by app

* The table/grid component must be updated like jqGrid component or more capable and more modern one

* username will be written on the header - bar

# Performance Optimization

* Price must be taken with date param also. No need to get all prices everytime

### Suggestions for Future Enhancements (grok)

* Toggleable Sidebar: Add a hamburger menu to show/hide the sidebar on mobile instead of just collapsing it.
* Example: Add a < button > in .top-bar to toggle a sidebar-open class.
* Active Link Styling: Highlight the current page in the sidebar (e.g., via NavLink and .active class).
* User Info in Top Bar: Display the username next to the logout icon (fetch from localStorage).
* Membership Integration: Later, add a dropdown or link under "Profil" for membership options.

### Profile page

 A popup can appear when clicked. On the popup Change Password link, membership link (disabled for now)
can appear. When clicked password change its page can be opened without layout
and when it is successfully changed user is redirected to the login page.


### Profiles

* Dev, Test and Prod profiles must have their own application.yaml file

* According to the active profile the right configuration must be active




### Configuration

* Some hardcoded values must be in the config like "localhost:3000"

* Secret key value must be managed more secure

### Admin Page

* User email update operations can be managed by admin only with a direct request from the customer.  
When email is updated a verification mail must be sent to the new email address as if the 
user is newly signed in.

* User reports such as howmany customers, grouped by their memberships and used resources.

### Notification Page

* User may define their threshold values for the prices. For exceeding any threshold of a product (maybe min/max thresholds) the user may 
be notified by email/(sms in the future)


### Anroid App 

* Viewing the prices and
* notification by the app in the phone
* 