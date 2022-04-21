# SportsMap  
Нужна Visual studio + visual studio code(для фронта)  
Нужен Node JS 17.8.0 angular 12  
Если шо пишите в дс anku25#0301 помогу, объясню  
Модели с базы в код:  
Scaffold-DbContext "Data Source=LV-LAS-SC-0379;Initial Catalog=Sportsmap;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models  
Что бы запустить фронт:  
Package.json -> npm scrips -> start  
Поменять Connection string к базе API->models->SportsMapContext->line 24->useSQLServer(*yourconnectionstring*)  
Что бы гугл ауентификация видела ваш акк, напишите мне я добавлю в список(пока что там whitelist, позже сделаю доступным всем)  
Бекап базы тоже в репозитории есть, желательно, что бы кто то заполнил базу тестовыми данными и закомитил обратно что бы у всех были данные и работать было удобнее)  
