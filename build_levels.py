import json
from pathlib import Path
root=Path(__file__).parent
def level(n,name,subtitle,segments,hazards=[],gates=[],switches=[],crates=[],lifts=[]):
    platforms=[dict(x=x,y=y,w=w,h=720-y) for x,y,w in segments]
    last=segments[-1][1]
    return dict(id=n,name=name,subtitle=subtitle,platforms=platforms,hazards=[dict(x=x,y=y,w=w,h=14,type=t) for x,y,w,t in hazards],gates=gates,switches=switches,crates=[dict(x=x,y=y,w=36,h=36) for x,y in crates],lifts=lifts,spawn=[dict(x=55,y=segments[0][1]-38),dict(x=105,y=segments[0][1]-38)],exits=[dict(x=1090,y=last-58,w=38,h=58,type='fire'),dict(x=1142,y=last-58,w=38,h=58,type='water')],gems=[dict(x=x+w/2,y=y-65,type=('fire' if i%2==0 else 'water')) for i,(x,y,w) in enumerate(segments)])
def gate(x,y,ids,mode='all'): return dict(x=x,y=0,w=24,h=y,requires=ids,mode=mode)
def plate(id,x,y,type='any',group=None): return dict(id=id,x=x,y=y-7,w=48,h=7,kind='plate',type=type,group=group,latch=True)
def lever(id,x,y,duration=0,type='any'):return dict(id=id,x=x,y=y-50,w=26,h=50,kind='lever',duration=duration,type=type)
L=[]
L.append(level(1,'Первый свет','Освойте прыжки. Дойдите вдвоём до своих порталов.',[(0,630,280),(280,580,260),(540,525,250),(790,470,410)],[(345,580,85,'fire'),(605,525,85,'water')]))
L.append(level(2,'Две стихии','Искра не боится огня, Капля — воды. Зелёный туман опасен обоим.',[(0,620,230),(230,550,260),(490,620,220),(710,550,250),(960,480,240)],[(265,550,130,'fire'),(525,620,130,'water'),(765,550,110,'acid')]))
L.append(level(3,'Следы на камне','Наступите на плиту: она навсегда откроет проход.',[(0,630,260),(260,560,300),(560,490,270),(830,440,370)],[(345,560,100,'acid')],[gate(725,490,['a'])],[plate('a',195,630)]))
L.append(level(4,'Забытый механизм','Рычаги: Искра — E, Капля — ↓. Найдите оба.',[(0,620,220),(220,545,250),(470,475,240),(710,545,220),(930,475,270)],[(540,475,100,'water'),(770,545,100,'fire')],[gate(895,545,['a','b'])],[lever('a',350,545),lever('b',640,475)]))
L.append(level(5,'Вес решения','Толкните ящик на квадратную плиту. Только ящик включает этот механизм.',[(0,630,360),(360,560,260),(620,490,280),(900,430,300)],[(410,560,120,'acid')],[gate(795,490,['a'])],[plate('a',285,630,'crate')],[(205,594)]))
L.append(level(6,'Подъём в тишине','Прыгните на движущуюся платформу, чтобы преодолеть высокий уступ.',[(0,640,330),(580,430,260),(840,365,360)],[],[gate(1000,365,['a'])],[lever('a',725,430)],[],[dict(x=350,y=600,w=190,h=18,low=600,high=385,speed=65)]))
L.append(level(7,'В одном ритме','Встаньте одновременно на две цветные плиты. Механизм запомнит ваш союз.',[(0,620,360),(360,550,280),(640,480,260),(900,420,300)],[(690,480,120,'acid')],[gate(845,480,['a','b'])],[plate('a',240,620,'fire','duet'),plate('b',480,550,'water','duet')]))
L.append(level(8,'Двенадцать секунд','Рычаг откроет ворота на 12 секунд. Сначала соберитесь рядом.',[(0,630,250),(250,565,230),(480,500,240),(720,565,220),(940,495,260)],[(535,500,100,'acid'),(775,565,100,'acid')],[gate(1035,495,['a'])],[lever('a',385,565,12)]))
L.append(level(9,'Три ключа','Ящик, Искра и Капля: каждому достался свой механизм.',[(0,640,350),(350,570,250),(600,500,280),(880,430,320)],[(390,570,110,'water'),(655,500,110,'fire')],[gate(560,570,['a']),gate(835,500,['b']),gate(1025,430,['c'])],[plate('a',275,640,'crate'),lever('b',520,570,0,'fire'),lever('c',790,500,0,'water')],[(190,604)]))
L.append(level(10,'Сердце равновесия','Пройдите три испытания: вес, единство и гонка к последним воротам.',[(0,640,320),(320,570,220),(540,500,250),(790,560,200),(990,490,210)],[(350,570,100,'acid'),(820,560,105,'acid')],[gate(500,570,['a']),gate(755,500,['b','c']),gate(1050,490,['d'])],[plate('a',255,640,'crate'),plate('b',580,500,'fire','final'),plate('c',665,500,'water','final'),lever('d',705,500,12)],[(170,604)]))
(root/'levels.json').write_text(json.dumps(dict(version=1,levels=L),ensure_ascii=False,indent=2))
(root/'levels.js').write_text('window.LEVEL_DATA = '+json.dumps(L,ensure_ascii=False)+';\n')
