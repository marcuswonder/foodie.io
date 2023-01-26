const Recipe = require('../models/recipe')
const Collection = require('../models/collection')

module.exports = {
    index,
    new: newRecipe,
    create,
    show,
    showIngredients,
    updateIngredients,
    showInstructions,
    updateInstructions,
    deleteRecipe,
    addToCollection,
    editRecipe,
    updateRecipe,
    editRecipeIngredients,
    editRecipeInstructions,
    deleteInstruction,
    deleteIngredient,
}

function index(req, res) {
    Recipe.find({}, function(err, recipes) {
        res.render('recipes/index', { recipes })
    })
}

function newRecipe(req, res) {
    res.render('recipes/new')
}


function create(req, res) {
    if(!req.user) return res.redirect('/users/login');
    const recipe = new Recipe(req.body);
    recipe.author = req.user._id;
    recipe.userName = req.user.name
    recipe.gId = req.user.googleId
    recipe.save(function(err) {
        if (err) return res.redirect('/recipes');
        console.log(err)
        res.redirect(`/recipes/${recipe._id}/ingredients`);
        });
}

function show(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        Collection.find({}, function(err, collections) {
        res.render('recipes/show', { recipe, collections })
        })
    })
}

function showIngredients(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/ingredients', { recipe })
    })
}
    
function updateIngredients(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        recipe.ingredients.push(req.body);
        recipe.save(function(err) {
            if (err) return res.redirect('/recipes')
            console.log(err)
        res.render('recipes/ingredients', { recipe });
      });
    });
  }

  function showInstructions(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/instructions', { recipe })
    })
}
    
function updateInstructions(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        recipe.instructions.push(req.body);
        recipe.save(function(err) {
            if (err) return res.redirect('/recipes')
            console.log(err)
        res.render('recipes/instructions', { recipe });
      });
    });
  }


  async function deleteRecipe(req, res, next) {
    try {
        await Recipe.remove({'_id': req.params.id})
        res.redirect('/recipes')
    } catch(err) {
        return next(err)
    }
}

function addToCollection(req, res) {
    console.log("I'm hit!")
    console.log(req.params) // Recipe 
    console.log(req.body.collection_id) // Collection
    Collection.findById(req.body.collection_id, function(err, collection) {
        collection.recipes.push(req.params.id);
        collection.save()
        res.redirect(`/recipes/${req.params.id}`);
    })
}

function editRecipe(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/update', { recipe })
    })
}

function updateRecipe(req, res) {
    console.log("Edit Recipe being hit!")
    console.log(req.body)
    Recipe.findById(req.params.id, function(err, recipe) {
        recipe.name = req.body.name
        recipe.description = req.body.description
        recipe.prepTime = req.body.prepTime
        recipe.cookTime = req.body.cookTime
        recipe.category = req.body.category
        recipe.servings = req.body.servings
        recipe.save()
        res.redirect(`/recipes/${req.params.id}`)
    })
}

function editRecipeIngredients(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/updateingredients', { recipe })
    })
}

function editRecipeInstructions(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/updateinstructions', { recipe })
    })
}

function deleteInstruction(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
    console.log(req.params.id)
    res.redirect(`/recipes/${req.params.id}/edit/instructions`)
    // res.render('recipes/updateinstructions', { recipe })
    })
}

async function deleteIngredient(req, res) {
    console.log("Delete Ingredient being hit")
    try {
        const recipe = await Recipe.findOne({'recipes._id': req.params.id})
        if(!recipe) return res.redirect('/recipes')
        recipe.ingredients.remove(req.params.id)
        await recipe.save
        res.redirect(`recipe/${recipe._id}`)
    } catch(err) {
        return next(err)
    }
}

