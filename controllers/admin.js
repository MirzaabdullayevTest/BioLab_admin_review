const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const toDelete = require("../utils/toDelete");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const Partner = require("../models/Partner");
const Product = require("../models/Product");

// =================== > Admin pages
module.exports.getAdminPanel = async (req, res) => {
  const { name, id, avatar } = await req.admin;
  res.render("admin/adminHome", {
    layout: "admin",
    title: "Админ",
    name,
    _id: id,
    avatar,
  });
};

module.exports.getAdminEditPage = async (req, res) => {
  const { name, login, _id, avatar } = await Admin.findById(req.params.id);
  res.render("admin/editAdmin", {
    layout: "admin",
    name,
    login,
    _id,
    avatar,
  });
};

module.exports.updateAdmin = async (req, res) => {
  const { avatar } = await Admin.findById(req.params.id);
  const admin = req.body;
  const hashPassword = await bcrypt.hash(admin.password, 10);
  admin.password = hashPassword;

  if (req.file) {
    toDelete(avatar);
    admin.avatar = req.file.filename;
  }

  await Admin.findByIdAndUpdate(req.params.id, admin, (err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/admin");
  });
};

module.exports.deleteAdmin = async (req, res) => {
  const { avatar } = await Admin.findById(req.params.id);
  await Admin.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      toDelete(avatar);
      res.redirect("/auth/login");
    }
  });
};

// =================== > Category pages
// GET all categories
module.exports.getCategoriesPage = async (req, res) => {
  const { name, id, avatar } = await req.admin;

  const categories = await Category.find();
  res.render("admin/categories", {
    layout: "admin",
    title: "Посмотреть категории",
    categories,
    name,
    id,
    avatar,
  });
};

// Go to category add page
module.exports.getAddCategoryPage = (req, res) => {
  res.render("admin/addCategory", {
    layout: "admin",
    title: "Добавить категория",
  });
};

// ADD a new category
module.exports.createCategory = async (req, res) => {
  const category = new Category({
    title: req.body.title,
    text: req.body.text,
  });
  try {
    await category.save();
    res.redirect("/admin/categories");
  } catch (e) {
    console.log(e);
  }
};

// Go to category EDIT page
module.exports.getCategoryEditPage = async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render("admin/editCategory", {
    layout: "admin",
    category,
  });
};

// EDIT a category
module.exports.updateCategory = async (req, res) => {
  const category = req.body;
  await Category.findByIdAndUpdate(req.params.id, category, (err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/admin/categories");
  });
};

// DELETE category
module.exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/admin/categories");
    }
  });
};

// GET all products by categoryId
module.exports.getProductsByCategoryId = async (req, res) => {
  const { title } = await Category.findById(req.params.categoryId);

  let products = await Category.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.params.categoryId),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "categoryId",
        as: "products",
      },
    },
    {
      $unwind: {
        path: "$products", // ichkari kirdik
      },
    },
    {
      $group: {
        _id: {
          _id: "$_id",
        },
        products: {
          $push: "$products",
        },
      },
    },
    {
      $project: {
        _id: "$_id._id",
        name: "$_id.name",
        price: "$_id.price",
        priceSale: "$_id.priceSale",
        img: "$_id.img",
        products: "$products", //id ni chiqarmaslik
      },
    },
  ]);

  if (products.length) {
    products = products[0].products;
  }

  res.render("admin/category", {
    title: "Категория",
    layout: "admin",
    products,
    categoryName: title,
  });
};

// =========================== > Blog pages
// GET all blogs
module.exports.getAllBlogPage = async (req, res) => {
  const blogs = await Blog.find();
  res.render("admin/blogs", {
    layout: "admin",
    title: "Посмотреть блоги",
    blogs,
  });
};

// Go to add blog page
module.exports.getAddBlogPage = (req, res) => {
  res.render("admin/addBlog", {
    layout: "admin",
    title: "Добавить блог",
  });
};

// ADD a new blog
module.exports.createBlog = async (req, res) => {
  try {
    const { text, data } = req.body;

    const img = req.file.filename;

    const blog = new Blog({
      text,
      data,
      img,
    });
    await blog.save();
    res.redirect("/admin/blogs");
  } catch (err) {
    console.log(err);
  }
};

// Go to blog EDIT page
module.exports.getBlogEditPage = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render("admin/editBlog", {
    title: "Блог",
    layout: "admin",
    blog,
  });
};

// EDIT a blog
module.exports.updateBlog = async (req, res) => {
  const { img } = await Blog.findById(req.params.id);
  const blog = req.body;

  if (req.file) {
    toDelete(img);
    blog.img = req.file.filename;
  }

  await Blog.findByIdAndUpdate(req.params.id, blog, (err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/admin/blogs");
  });
};

// DELETE blog
module.exports.deleteBlog = async (req, res) => {
  const { img } = await Blog.findById(req.params.id);
  await Blog.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      toDelete(img);
      res.redirect("/admin/blogs");
    }
  });
};

// =========================== > Partner pages
// GET all partners
module.exports.getAllPartnerPage = async (req, res) => {
  const partners = await Partner.find();
  res.render("admin/partners", {
    layout: "admin",
    title: "Посмотреть партнеры",
    partners,
  });
};

// Go to partner add page
module.exports.getAddPartnerPage = (req, res) => {
  res.render("admin/addPartner", {
    layout: "admin",
    title: "Добавить партнер",
  });
};

// ADD a new partner
module.exports.createPartner = async (req, res) => {
  try {
    const { partner, link } = req.body;

    const img = req.file.filename;

    const brand = new Partner({
      partner,
      link,
      img,
    });
    await brand.save();
    res.redirect("/admin/partners");
  } catch (err) {
    console.log(err);
  }
};

// Go to partner EDIT page
module.exports.getPartnerEditPage = async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  res.render("admin/editPartner", {
    title: "Партнер",
    layout: "admin",
    partner,
  });
};

// EDIT a partner
module.exports.updatePartner = async (req, res) => {
  const { img } = await Partner.findById(req.params.id);
  const partner = req.body;

  if (req.file) {
    toDelete(img);
    partner.img = req.file.filename;
  }

  await Partner.findByIdAndUpdate(req.params.id, partner, (err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/admin/partners");
  });
};

// DELETE partner
module.exports.deletePartner = async (req, res) => {
  const { img } = await Partner.findById(req.params.id);
  await Partner.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      toDelete(img);
      res.redirect("/admin/partners");
    }
  });
};

// =========================== > Partner pages
// GET all products
module.exports.getAllProductPage = async (req, res) => {
  const products = await Product.find();
  res.render("admin/products", {
    layout: "admin",
    title: "Посмотреть продукты",
    products,
  });
};

// Go to product add page
module.exports.getAddProductPage = async (req, res) => {
  const categories = await Category.find();
  res.render("admin/addProduct", {
    layout: "admin",
    title: "Добавить продукт",
    categories,
  });
};

// ADD a new product
module.exports.createProduct = async (req, res) => {
  try {
    const { name, price, priceSale, categoryId, info } = req.body;
    var imgs = [];
    if (req.files) {
      imgs = req.files.map((c) => {
        return { img: c.filename };
      });
    } else {
      imgs = "";
    }

    console.log(imgs);

    let product = new Product({
      name,
      price,
      priceSale,
      imgs,
      info,
      categoryId,
    });
    await product.save();
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

module.exports.openProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("admin/productPage", {
    layout: "admin",
    product,
  });
};

// Go to product EDIT page
module.exports.getProductEditPage = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("admin/editProduct", {
    layout: "admin",
    product,
  });
};

module.exports.updateProduct = async (req, res) => {
  const { imgs } = await Product.findById(req.params.id);
  const product = req.body;

  if (req.files) {
    let newImgs = [];
    imgs.map(c => {
      toDelete(c.img);
    })

    newImgs = req.files.map((c, i) => {
      return {
        img: c.filename,
        id: i
      };
    });

    product.imgs = newImgs;
  }

  await Product.findByIdAndUpdate(req.params.id, product, (err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/admin/products");
  });
};

// DELETE product
module.exports.deleteProduct = async (req, res) => {
  const { img } = await Product.findById(req.params.id);
  await Product.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      toDelete(img);
      res.redirect("/admin/products");
    }
  });
};
