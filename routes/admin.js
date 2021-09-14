const {
    Router
} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const fileMiddleware = require('../middleware/file')
const controllerAdmin = require('../controllers/admin')

// =========================== > Admin pages
router.get('/', auth, controllerAdmin.getAdminPanel)
router.get('/edit/:id', auth, controllerAdmin.getAdminEditPage)
router.post('/edit/:id', auth, fileMiddleware.single('avatar'), controllerAdmin.updateAdmin)
router.get('/remove/:id', auth, controllerAdmin.deleteAdmin)

// =========================== > Category pages
// GET all categories
router.get('/categories', auth, controllerAdmin.getCategoriesPage)

// Go to category add page 
router.get('/category/add', auth, controllerAdmin.getAddCategoryPage)

// ADD a new category
router.post('/category/add', auth, controllerAdmin.createCategory)

// Go to category EDIT page
router.get('/category/edit/:id', auth, controllerAdmin.getCategoryEditPage)

// EDIT a category
router.post('/category/edit/:id', auth, controllerAdmin.updateCategory)

// DELETE category
router.get('/category/remove/:id', auth, controllerAdmin.deleteCategory)

// GET all products by categoryId 
router.get('/category/products/:categoryId', auth, controllerAdmin.getProductsByCategoryId)

// =========================== > Blog pages
// GET all blogs
router.get('/blogs', auth, controllerAdmin.getAllBlogPage)

// Go to blog add page 
router.get('/blog/add', auth, controllerAdmin.getAddBlogPage)

// ADD a new blog
router.post('/blog/add', auth, fileMiddleware.single('img'), controllerAdmin.createBlog)

// Go to blog EDIT page
router.get('/blog/edit/:id', auth, controllerAdmin.getBlogEditPage)

// EDIT a blog
router.post('/blog/edit/:id', auth, fileMiddleware.single('img'), controllerAdmin.updateBlog)

// DELETE blog
router.get('/blog/remove/:id', auth, controllerAdmin.deleteBlog)

// =========================== > Partner pages
router.get('/partners', auth, controllerAdmin.getAllPartnerPage)

// Go to partner add page 
router.get('/partner/add', auth, controllerAdmin.getAddPartnerPage)

// ADD a new partner
router.post('/partner/add', auth, fileMiddleware.single('img'), controllerAdmin.createPartner)

// Go to partner EDIT page
router.get('/partner/edit/:id', auth, controllerAdmin.getPartnerEditPage)

// EDIT a partner
router.post('/partner/edit/:id', auth, fileMiddleware.single('img'), controllerAdmin.updatePartner)

// DELETE partner
router.get('/partner/remove/:id', auth, controllerAdmin.deletePartner)

// =========================== > Product pages
// GET all products
router.get('/products', auth, controllerAdmin.getAllProductPage)

// Go to product add page 
router.get('/product/add', auth, controllerAdmin.getAddProductPage)

// open one product page
router.get('/product/:id', auth, controllerAdmin.openProduct)

// ADD a new product
router.post('/product/add', auth, fileMiddleware.array('img', 4), controllerAdmin.createProduct)

// Go to product EDIT page
router.get('/product/edit/:id', auth, controllerAdmin.getProductEditPage)

// EDIT a product
router.post('/product/edit/:id', auth, fileMiddleware.array('img', 4), controllerAdmin.updateProduct)

// DELETE product
router.get('/product/remove/:id', auth, controllerAdmin.deleteProduct)

module.exports = router