from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from bs4 import BeautifulSoup


# 1) TOP 100 카드 목록 가져오기
def get_top100_cards(date="2025-11-22"):
    url = f"https://www.card-gorilla.com/chart/top100?term=monthly&date={date}"

    options = Options()
    # options.add_argument("--headless")  # 필요하면 주석 해제
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )
    driver.get(url)

    time.sleep(3)  # JS 렌더링 대기

    print(driver.page_source)
    print('=========')

    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    items = soup.select("ul.rk_lst > li")
    cards = []

    for item in items:
        try:
            name = item.select_one(".card_name").text.strip()
            corp = item.select_one(".corp_name span").text.strip()
            detail_href = item.select_one("a[href^='/card/detail']")["href"]

            cards.append({
                "name": name,
                "corp": corp,
                "detail_url": "https://www.card-gorilla.com" + detail_href
            })
        except:
            continue

    return cards


# 2) 카드 상세 페이지에서 "주요혜택" 영역 크롤링
def get_card_main_benefits(detail_url):
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless")  # 디버깅 끝나면 켜도 됨
    options.add_argument("--disable-blink-features=AutomationControlled")

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )

    print(f"🔎 상세페이지 접속: {detail_url}")
    driver.get(detail_url)

    # ✅ SPA라서 렌더링 시간 여유 있게 줌
    #   그리고 iframe 절대 안 건드림 (너가 준 HTML에 iframe 없음)
    try:
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "article.cmd_con.benefit div.bene_area dl")
            )
        )
    except:
        print("❌ 주요혜택(bene_area) 요소 로딩 실패")
        # 디버깅용으로 페이지 일부 찍어보는 것도 가능
        # print(driver.page_source[:1000])
        driver.quit()
        return []

    time.sleep(1)  # 아주 살짝 더 대기 (문구 다 들어올 때까지)

    dl_list = driver.find_elements(By.CSS_SELECTOR, "article.cmd_con.benefit div.bene_area dl")
    benefits = []

    for dl in dl_list:
        try:
            benefit_type = dl.find_element(By.CSS_SELECTOR, "p.txt1").text.strip()
            description = dl.find_element(By.TAG_NAME, "i").text.strip()

            benefits.append({
                "benefit_type": benefit_type,
                "description": description
            })
        except Exception as e:
            print("⚠️ 파싱 중 오류:", e)
            continue

    driver.quit()
    return benefits


if __name__ == "__main__":
    # 개별 카드 테스트
    url = "https://www.card-gorilla.com/card/detail/2807"
    benefits = get_card_main_benefits(url)

    print("\n=====! 추출된 혜택 !=====")
    for b in benefits:
        print(b)

    # # TOP100 + 각 카드 혜택까지 돌리고 싶으면 아래 주석 풀면 됨
    # cards = get_top100_cards()
    # for card in cards[:3]:  # 테스트용으로 앞의 3개만
    #     print("\n###", card["name"], card["corp"])
    #     bens = get_card_main_benefits(card["detail_url"])
    #     for b in bens:
    #         print("  -", b)


# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.options import Options
# from webdriver_manager.chrome import ChromeDriverManager
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# import time
# from bs4 import BeautifulSoup
# import requests

# def get_top100_cards(date="2025-06-01"):
#     url = f"https://www.card-gorilla.com/chart/top100?term=monthly&date={date}"

#     options = Options()
#     # options.add_argument("--headless") # 필요하면 적용
#     driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()),
#                               options=options)
#     driver.get(url)

#     time.sleep(3)  # JS 렌더링 대기

#     soup = BeautifulSoup(driver.page_source, "html.parser")
#     driver.quit()

#     items = soup.select("ul.rk_lst > li")
#     cards = []

#     for item in items:
#         try:
#             name = item.select_one(".card_name").text.strip()
#             corp = item.select_one(".corp_name span").text.strip()
#             detail_href = item.select_one("a[href^='/card/detail']")["href"]

#             cards.append({
#                 "name": name,
#                 "corp": corp,
#                 "detail_url": "https://www.card-gorilla.com" + detail_href
#             })
#         except:
#             continue

#     return cards

# # def get_card_main_benefits(detail_url):
#     res = requests.get(detail_url, headers={"User-Agent": "Mozilla/5.0"})
#     soup = BeautifulSoup(res.text, "html.parser")

#     benefit_section = soup.select_one("article.cmd_con.benefit")

#     if not benefit_section:
#         print("❌ 주요혜택 영역이 없습니다.")
#         return []

#     dl_list = benefit_section.select("div.bene_area dl")

#     benefits = []
    
#     for dl in dl_list:
#         try:
#             benefit_type = dl.select_one("p.txt1").text.strip()
#             description = dl.select_one("i").text.strip()

#             benefits.append({
#                 "benefit_type": benefit_type,
#                 "description": description
#             })
#         except:
#             continue

#     return benefits


# # if __name__ == "__main__":
#     cards = get_top100_cards()
#     for card in cards:
#         print(card)
# # def get_card_main_benefits(detail_url):
#     options = webdriver.ChromeOptions()
#     # options.add_argument("--headless")  # 디버깅 시 주석 처리
#     options.add_argument("--disable-blink-features=AutomationControlled")

#     driver = webdriver.Chrome(
#         service=Service(ChromeDriverManager().install()),
#         options=options
#     )

#     driver.get(detail_url)
#     time.sleep(1)

#     # 1️⃣ iframe 로드 기다리기
#     iframe = WebDriverWait(driver, 10).until(
#         EC.presence_of_element_located((By.TAG_NAME, "iframe"))
#     )
#     driver.switch_to.frame(iframe)

#     # 2️⃣ 주요 혜택 영역 로드 기다리기
#     WebDriverWait(driver, 10).until(
#         EC.presence_of_element_located((By.CSS_SELECTOR, "div.bene_area"))
#     )

#     # 3️⃣ 혜택 추출
#     dl_list = driver.find_elements(By.CSS_SELECTOR, "div.bene_area dl")
#     benefits = []

#     for dl in dl_list:
#         try:
#             benefit_type = dl.find_element(By.CSS_SELECTOR, "p.txt1").text.strip()
#             description = dl.find_element(By.TAG_NAME, "i").text.strip()

#             benefits.append({
#                 "benefit_type": benefit_type,
#                 "description": description
#             })
#         except:
#             continue

#     driver.quit()
#     return benefits

# def get_card_main_benefits(detail_url):

#     options = webdriver.ChromeOptions()
#     # options.add_argument("--headless")
#     options.add_argument("--disable-blink-features=AutomationControlled")
#     options.add_argument("--start-maximized")

#     driver = webdriver.Chrome(
#         service=Service(ChromeDriverManager().install()),
#         options=options
#     )

#     driver.get(detail_url)
#     time.sleep(1)

#     # 1️⃣ 먼저 iframe이 있는지 확인
#     iframes = driver.find_elements(By.TAG_NAME, "iframe")

#     if len(iframes) > 0:
#         print("📌 iframe 감지됨 → iframe 진입")
#         driver.switch_to.frame(iframes[0])
#     else:
#         print("📌 iframe 없음 → 그대로 진행")

#     # 2️⃣ 주요 혜택 영역 로드 대기 (iframe 내부 or 본문 직접)
#     try:
#         WebDriverWait(driver, 10).until(
#             EC.presence_of_element_located((By.CSS_SELECTOR, "div.bene_area"))
#         )
#     except:
#         print("❌ bene_area 요소 로딩 실패")
#         driver.quit()
#         return []

#     time.sleep(1)  # React 렌더링 대기

#     # 3️⃣ 주요 혜택 추출
#     dl_list = driver.find_elements(By.CSS_SELECTOR, "div.bene_area dl")
#     benefits = []

#     for dl in dl_list:
#         try:
#             benefit_type = dl.find_element(By.CSS_SELECTOR, "p.txt1").text.strip()
#             description = dl.find_element(By.TAG_NAME, "i").text.strip()
#             benefits.append({
#                 "benefit_type": benefit_type,
#                 "description": description
#             })
#         except:
#             continue

#     driver.quit()
#     return benefits


# # 테스트
# url = "https://www.card-gorilla.com/card/detail/2807"
# benefits = get_card_main_benefits(url)

# print("\n===== 추출된 혜택 =====")
# for b in benefits:
#     print(b)



        