const fetch = require("node-fetch");
const FormData = require("form-data");
const ApiError = require("../error/ApiError");
class frontpadController {
  async create(req, res, next) {
    try {
      const {
        street,
        name,
        phone,
        descr,
        pay,
        mail,
        product,
        product_kol,
        product_mod,
      } = req.body;

      console.log("Код:", product);
      console.log("Street:", street);
      console.log("Name:", name);
      console.log("Phone:", phone);
      console.log("Description:", descr);
      console.log("Payment Method:", pay);
      console.log("Mail:", mail);

      function padProduct(product) {
        const padValue = (val) => {
          const n = parseInt(val, 10);
          return String(n).padStart(5, '0');
        };
      
        if (Array.isArray(product)) {
          return product.map(padValue);
        } else {
          return padValue(product);
        }
      }
      
      const products = padProduct(product || []);
      const quantities = product_kol || [];
      const modifiers = product_mod || [];

      const formData = new FormData(); // Создаем экземпляр FormData

      const params = {
        secret: process.env.API_FRONTPAD,
        street: street,
        name: name,
        phone: phone,
        descr: descr ? descr : "",
        pay: pay,
        mail: mail ? mail : "",
      };

      console.log(params);

      // Заполняем formData основными параметрами
      for (const key in params) {
        formData.append(key, params[key]);
      }

      // Добавляем продукты и их характеристики в formData
      products.forEach((productItem, index) => {
        formData.append(`product[${index}]`, productItem);
        formData.append(`product_kol[${index}]`, quantities[index] || 0); // Если количество не указано, ставим 0

        if (modifiers[index] !== undefined) {
          formData.append(`product_mod[${index}]`, modifiers[index]);
        }
      });

      // Отправляем POST-запрос на новый адрес
      const response = await fetch(
        "https://app.frontpad.ru/api/index.php?new_order",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.text();
      console.log("Response from API:", result);

      res.status(200).json({ message: "Данные получены и обработаны" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new frontpadController();
