import { useEffect, useRef } from "react";
import "./book-content.css";
import BookContentBody from "../book-content-body/book-content-body";
// import { delay } from "framer-motion";

function BookContent({
  maximazed,
  bookContent,
  formFontSize,
  autoScrollContent,
  scrollSpeed,
  handleAutoScrollContent,
  handleNavTags,
  FileName,
}) {
  const currentScrollRef = useRef(0);
  const animationFrameRef = useRef(null);

  //Maximize || Minimize content || Change Font Size
  //Jump to stored position
  useEffect(() => {
    const scrollableDiv = document.getElementById("scrollableDiv");
    if (bookContent && scrollableDiv) {
      if (localStorage.getItem("currentObject")) {
        const currentObject = localStorage.getItem("currentObject");
        const currentObjectPosition = localStorage.getItem("currentObjectPosition");

        const elCollection = scrollableDiv.getElementsByTagName("p");
        const { top: elTop } = elCollection[currentObject].getBoundingClientRect();

        scrollableDiv.scrollTo(
          0,
          scrollableDiv.scrollTop + elTop - currentObjectPosition - scrollableDiv.getBoundingClientRect().top,
        );
        localStorage.removeItem("currentObject");
        localStorage.removeItem("currentObjectPosition");
      } else {
        scrollableDiv.scrollTo(
          0,
          (localStorage.getItem(FileName) * (scrollableDiv.scrollHeight - scrollableDiv.clientHeight)) / 100,
        );
      }
    }
  }, [FileName, bookContent, maximazed, formFontSize]);

  //Display scroll progress and update on scroll event
  useEffect(() => {
    const scrollableDiv = document.getElementById("scrollableDiv");
    if (scrollableDiv) {
      const progress = document.getElementById("progress");
      const timeProgress = document.getElementById("timeProgress");

      scrollableDiv.addEventListener(
        "scroll",
        () => {
          const totalSeconds =
            (scrollableDiv.scrollHeight - scrollableDiv.scrollTop - scrollableDiv.clientHeight) / (scrollSpeed * 20);
          let date = new Date(1970, 0, 0, 0, 0, +totalSeconds || 0);
          const scrollPercent =
            (scrollableDiv.scrollTop / (scrollableDiv.scrollHeight - scrollableDiv.clientHeight)) * 100;
          progress.innerHTML = scrollPercent
            ? `<span class="readProgress bg-dark text-warning text-center">${scrollPercent.toFixed(3)}%</span>`
            : "Навигация";

          timeProgress.innerHTML = autoScrollContent
            ? `<span class="timeProgress">
              ${Math.floor(totalSeconds / 3600 / 24) || ""} ${
                Math.floor(totalSeconds / 3600 / 24) ? "д." : ""
              } ${date.toLocaleTimeString()}
            </span>`
            : ``;
          localStorage.setItem(FileName, scrollPercent);
        },
        { passive: true },
      );
    }
  }, [FileName, scrollSpeed, autoScrollContent]);

  useEffect(() => {
    const scrollableDiv = document.getElementById("scrollableDiv");

    // Если автоскролл выключен или нет контента/дива — чистим анимацию и выходим
    if (!bookContent || !scrollableDiv || !autoScrollContent) {
      cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    // Пересчитываем скорость.
    const speed = scrollSpeed * 0.2;

    // Синхронизируем стартовую позицию ref с текущим скроллом дива
    currentScrollRef.current = scrollableDiv.scrollTop;

    // Флаг, указывающий, что пользователь СЕЙЧАС активно скроллит сам
    let isUserInteracting = false;
    let interactionTimeout = null;

    const smoothScroll = () => {
      // Если пользователь крутит мышь или держит скроллбар, анимация ждет
      if (isUserInteracting) {
        animationFrameRef.current = requestAnimationFrame(smoothScroll);
        return;
      }

      // Увеличиваем дробное значение позиции
      currentScrollRef.current += speed;

      // Проверяем, не дошли ли до конца книги
      const maxScroll = scrollableDiv.scrollHeight - scrollableDiv.clientHeight;

      if (currentScrollRef.current >= maxScroll - 0.5) {
        scrollableDiv.scrollTop = maxScroll;
        cancelAnimationFrame(animationFrameRef.current);
        return;
      }

      // Применяем к элементу
      scrollableDiv.scrollTop = currentScrollRef.current;

      // Запрашиваем следующий плавный кадр
      animationFrameRef.current = requestAnimationFrame(smoothScroll);
    };

    // Функция, которая фиксирует ручной ввод и временно «усыпляет» автоскролл
    const handleUserInteraction = () => {
      isUserInteracting = true;

      // Сбрасываем таймаут, если пользователь продолжает крутить колесико
      clearTimeout(interactionTimeout);

      // после ОСТАНОВКИ скролла пользователем, возвращаем автоскролл
      interactionTimeout = setTimeout(() => {
        currentScrollRef.current = scrollableDiv.scrollTop;
        isUserInteracting = false;
      }, 1000);
    };

    // Обработчик клавиш навигации
    const handleKeyDown = (e) => {
      const keys = ["Home", "End", "PageUp", "PageDown", "ArrowUp", "ArrowDown", " "];

      if (keys.includes(e.key)) {
        isUserInteracting = true;
        clearTimeout(interactionTimeout);

        // Даем браузеру обработать нажатие клавиши (скролл),
        // а на следующем «тике» считываем новую позицию
        interactionTimeout = setTimeout(() => {
          currentScrollRef.current = scrollableDiv.scrollTop;
          isUserInteracting = false;
        }, 1000);
      }
    };

    // Перехватываем физические действия пользователя
    scrollableDiv.addEventListener("wheel", handleUserInteraction, { passive: true });
    scrollableDiv.addEventListener("mousedown", handleUserInteraction);
    scrollableDiv.addEventListener("touchstart", handleUserInteraction, { passive: true });

    // Клавиатура
    window.addEventListener("keydown", handleKeyDown);

    // Запускаем анимацию
    animationFrameRef.current = requestAnimationFrame(smoothScroll);

    // Функция очистки при размонтировании или изменении зависимостей
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [scrollSpeed, bookContent, autoScrollContent]);

  useEffect(() => {
    const scrollableDiv = document.getElementById("scrollableDiv");
    if (scrollableDiv && bookContent) {
      const sections = scrollableDiv.getElementsByClassName("section");
      const navArray = [];
      const { height, top } = scrollableDiv.firstElementChild.getBoundingClientRect();
      //get sections info
      if (sections) {
        let counter = 0;
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].getElementsByClassName("title").length) {
            if (sections[i].getElementsByClassName("title")[0].innerText) {
              navArray[counter] = {
                innerText: sections[i].getElementsByClassName("title")[0].innerText,
                level: 0,
                sectionID: i,
                size: sections[i].getBoundingClientRect().height,
                heightPercentSize:
                  ((sections[i].getBoundingClientRect().top - top - scrollableDiv.clientHeight / 2) /
                    (height - scrollableDiv.clientHeight)) *
                  100,
                sectionHeightPercentSize: (sections[i].getBoundingClientRect().height / height) * 100,
              };
              counter++;
            }
          }
        }
      }
      //leveling sections
      for (let i = 0; i < navArray.length; i++) {
        for (let j = 0; j < navArray.length; j++) {
          if (i !== j && sections[navArray[i].sectionID].contains(sections[navArray[j].sectionID])) {
            navArray[j].level = navArray[i].level + 1;
          }
        }
      }
      handleNavTags(navArray);
    }
  }, [bookContent, handleNavTags, maximazed, formFontSize]);

  return (
    <>
      <div
        id="scrollableDiv"
        className={`book-content ${maximazed ? "maxContent" : "pageContent"}`}
        onClick={(e) => {
          if (maximazed) {
            e.preventDefault();
            if (autoScrollContent) {
              handleAutoScrollContent();
            } else {
              const scrollableDiv = document.getElementById("scrollableDiv");
              scrollableDiv.scrollTo(0, scrollableDiv.clientHeight + scrollableDiv.scrollTop - 30);
            }
          }
        }}
      >
        <BookContentBody body={bookContent} formFontSize={formFontSize} />
      </div>
    </>
  );
}

export default BookContent;
