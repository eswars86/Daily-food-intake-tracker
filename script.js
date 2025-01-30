class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || {};
        this.currentUser = localStorage.getItem('currentUser');
        this.init();
    }

    init() {
        this.authContainer = document.getElementById('authContainer');
        this.trackerContainer = document.getElementById('trackerContainer');
        this.authForm = document.getElementById('authForm');
        this.switchToSignup = document.getElementById('switchToSignup');
        this.authButton = document.getElementById('authButton');
        this.toggleAuth = document.getElementById('toggleAuth');
        this.logoutButton = document.getElementById('logoutButton');

        this.authForm.addEventListener('submit', (e) => this.handleAuth(e));
        if (this.switchToSignup) {
            this.switchToSignup.addEventListener('click', () => this.toggleAuthMode());
        }
        if (this.logoutButton) {
            this.logoutButton.addEventListener('click', () => this.logout());
        }

        if (this.currentUser) {
            this.showTracker();
        } else {
            this.showAuth();
        }
    }

    handleAuth(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (this.authButton.textContent === 'Sign Up') {
            if (this.users[email]) {
                alert('User already exists!');
            } else {
                this.users[email] = { email, password };
                localStorage.setItem('users', JSON.stringify(this.users));
                alert('Sign Up successful! Please login.');
                this.toggleAuthMode();
            }
        } else {
            if (this.users[email] && this.users[email].password === password) {
                this.currentUser = email;
                localStorage.setItem('currentUser', email);
                this.showTracker();
            } else {
                alert('Invalid credentials!');
            }
        }
    }

    toggleAuthMode() {
        const isLoginMode = this.authButton.textContent === 'Login';
        document.getElementById('authTitle').textContent = isLoginMode ? 'Sign Up' : 'Login';
        this.authButton.textContent = isLoginMode ? 'Sign Up' : 'Login';
        this.toggleAuth.innerHTML = isLoginMode
            ? 'Already have an account? <a href="#" id="switchToSignup">Login</a>'
            : 'Don\'t have an account? <a href="#" id="switchToSignup">Sign Up</a>';
        document.getElementById('switchToSignup').addEventListener('click', () => this.toggleAuthMode());
    }

    showAuth() {
        this.authContainer.style.display = 'block';
        this.trackerContainer.style.display = 'none';
    }

    showTracker() {
        this.authContainer.style.display = 'none';
        this.trackerContainer.style.display = 'block';
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.showAuth();
    }
}

// FoodTracker class to handle food logging and display
class FoodTracker {
    constructor() {
        this.foods = JSON.parse(localStorage.getItem('foodItems')) || [];
        this.form = document.getElementById('foodForm');
        this.foodList = document.getElementById('foodList');
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.displayFoods();
        this.updateSummary();
    }

    handleSubmit(e) {
        e.preventDefault();
        const foodImageInput = document.getElementById('foodImage');
        const foodImage = foodImageInput.files[0] ? URL.createObjectURL(foodImageInput.files[0]) : null;

        const food = {
            id: Date.now(),
            name: document.getElementById('foodName').value,
            calories: Number(document.getElementById('calories').value),
            protein: Number(document.getElementById('protein').value),
            carbs: Number(document.getElementById('carbs').value),
            fats: Number(document.getElementById('fats').value),
            time: new Date().toLocaleTimeString()
        };

        this.foods.push(food);
        this.saveFoods();
        this.displayFoods();
        this.updateSummary();
        this.form.reset();
    }

    displayFoods() {
        this.foodList.innerHTML = '';
        this.foods.forEach(food => {
            const foodElement = document.createElement('div');
            foodElement.className = 'food-item';
            foodElement.innerHTML = `
                <button class="delete-btn" onclick="tracker.deleteFood(${food.id})">×</button>
                <h3>${food.name}</h3>
                <p>Time: ${food.time}</p>
                <p>Calories: ${food.calories} | Protein: ${food.protein}g | Carbs: ${food.carbs}g | Fats: ${food.fats}g</p>
                ${food.image ? `<img src="${food.image}" alt="${food.name}" style="max-width: 100%; border-radius: 5px;">` : ''}
            `;
            this.foodList.appendChild(foodElement);
        });
    }

    updateSummary() {
        const totals = this.foods.reduce((acc, food) => {
            return {
                calories: acc.calories + food.calories,
                protein: acc.protein + food.protein,
                carbs: acc.carbs + food.carbs,
                fats: acc.fats + food.fats
            };
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

        document.getElementById('totalCalories').textContent = totals.calories;
        document.getElementById('totalProtein').textContent = totals.protein + 'g';
        document.getElementById('totalCarbs').textContent = totals.carbs + 'g';
        document.getElementById('totalFats').textContent = totals.fats + 'g';
    }

    deleteFood(id) {
        this.foods = this.foods.filter(food => food.id !== id);
        this.saveFoods();
        this.displayFoods();
        this.updateSummary();
    }

    saveFoods() {
        localStorage.setItem('foodItems', JSON.stringify(this.foods));
    }
}

// Initialize the AuthManager and FoodTracker
const authManager = new AuthManager();
const tracker = new FoodTracker();
