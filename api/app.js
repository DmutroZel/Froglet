import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import puppeteer from 'puppeteer';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://froglet-six.vercel.app',
    'https://froglet.vercel.app',
    /^https:\/\/froglet-.*\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Froglet',
      version: '1.0.0',
      description: 'Froglet documentation',
    },
   servers: [
  { url: process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000' },
  ],
  },
  apis: ['./app.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const sitesBase = [
    'https://ukr.media/animals/382929/',
    'https://facts.co.ua/page/czikavi-fakti-pro-zhab',
    'https://faktypro.com.ua/page/23-cikavi-fakti-pro-zhab',
    'https://faktypro.com.ua/page/23-cikavi-fakti-pro-zhab',
    
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Froglet API is running! 🐸' });
});

app.get('/frog-advice', async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-extensions',
        '--no-zygote',
        '--single-process', // на Render free це часто потрібно
      ],
    });

    const page = await browser.newPage();
    const randomIndex = Math.floor(Math.random() * sitesBase.length);
    await page.goto(sitesBase[randomIndex], { waitUntil: 'networkidle2', timeout: 30000 });

    const paragraphs = await page.$$('li');

    if (paragraphs.length === 0) {
      return res.status(500).json({ message: 'Не знайдено елементів на сторінці' });
    }

    // Зберемо всі тексти, що містять "жаба"
    const validTexts = [];
    const re = /(?<![А-Яа-яЇїІіЄєҐґA-Za-z])(?:жаба|жаби|жабі|жабу|жабою|жабам|жабами|жабах|жабо|жаб)(?![А-Яа-яЇїІіЄєҐґA-Za-z])/iu;

    for (const p of paragraphs) {
      const text = await page.evaluate(el => el.textContent.trim(), p);
      if (re.test(text)) {
        validTexts.push(text);
      }
    }

    await browser.close();

    if (validTexts.length > 0) {
      const randomFact = validTexts[Math.floor(Math.random() * validTexts.length)];
      res.json({ message: randomFact });
    } else {
      // Якщо нічого не знайшли — повертаємо fallback або випадковий текст
      const fallbackTexts = [
        'Жаби можуть дихати через шкіру.',
        'Деякі жаби можуть змінювати колір залежно від температури.',
        'Жаби — важлива частина екосистеми!'
      ];
      res.json({ message: fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)] });
    }

  } catch (error) {
    console.error('Error in /frog-advice:', error);
    if (browser) await browser.close();
    res.status(500).json({ message: 'Помилка при завантаженні факту про жабу' });
  }
});
/**
 * @openapi
 * /frog-advice:
 *   get:
 *     summary: Returns one text line
 *     tags:
 *       - Some froggy facts
 *     responses:
 *       200:
 *         description: Succesfull response
 *         content:
 *           application/json:
 *             example:
 *               message: Всього з описаних більш ніж 5000 видів земноводних практично 88% складають жаби.
 */


app.get('/your-kind-of-frog', async(req,res) => {
 const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-software-rasterizer',
    '--no-first-run',
    '--no-zygote',
    '--single-process'
  ]
});
  const page = await browser.newPage();
  await page.goto('https://californiaherps.com/allfrogs2.html');
   const paragraphs = await page.$$('em'); 

  if (paragraphs.length > 0) {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    const randomParagraph = paragraphs[randomIndex];

    const text = await page.evaluate(el => el.textContent, randomParagraph);

    res.json({species: text})
  } else {
    res.send('Elements not found').status(500)
  }
});
/**
 * @openapi
 * /your-kind-of-frog:
 *   get:
 *     summary: Returns one text line
 *     tags:
 *       - Some froggy species
 *     responses:
 *       200:
 *         description: Succesfull response
 *         content:
 *           application/json:
 *             example:
 *               {species: species of toad in Latin}
 *       500:
 *         description: Unsuccesfull response
 *         content:
 *           application/json:
 *             example:
 *               Elements not found
 *
 */

app.get('/frog-image', async(req, res) => {
 const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-software-rasterizer',
    '--no-first-run',
    '--no-zygote',
    '--single-process'
  ]
});

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
  );

  const url = 'https://unsplash.com/s/photos/frog';
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await sleep(2000);

  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await sleep(1500);
  }

  const images = await page.evaluate(() => {
    const result = [];
    const re = /\b(?:frog)\b/iu;
    const imgs = document.querySelectorAll('img[srcset][alt]');
    imgs.forEach((img) => {
      const srcset = img.srcset.split(',').map((s) => s.trim());
      const best = srcset[srcset.length - 1]?.split(' ')[0] || img.src;
      if(re.test(img.alt)){
      result.push({
        alt: img.alt,
        imageUrl: best,
      });  
      } 
      
    });
    return result;
  });

  await browser.close();

  if (!images.length) {
    console.error('Не знайдено зображень.');
    res.send("Elements not found").status(500);
  } else {
    const random = images[Math.floor(Math.random() * images.length)];
    console.log(random);
    res.json(random);
  };

});
/**
 * @openapi
 * /frog-image:
 *   get:
 *     summary: Returns object with url
 *     tags:
 *       - Some froggy species
 *     responses:
 *       200:
 *         description: Succesfull response
 *         content:
 *           application/json:
 *             example:
 *               {
 *                  alt: name of image,
 *                  imageUrl: url on current image,
 *               }
 *       500:
 *         description: Unsuccesfull response
 *         content:
 *           application/json:
 *             example:
 *               Elements not found

 */

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

