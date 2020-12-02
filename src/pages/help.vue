<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col lg="6" md="8" sm="12">
        <v-card class="elevation-24">
          <v-toolbar dark flat>
            <v-toolbar-title style="font-weight: bold">시설물 도화 사용법</v-toolbar-title>
          </v-toolbar>

          <!-- 단축키 -->
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-card-title style="font-weight: bold">단축키</v-card-title>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-divider />
                <v-card-subtitle>전역 단축키</v-card-subtitle>
                <v-card-text>
                  <kbd>Enter</kbd> - 도화 데이터를 제출한다
                </v-card-text>
                <v-card-text><kbd>Escape</kbd> - 선택해제 - 해제할 데이터가 없으가 시설물을 새로고침한다</v-card-text>
                <v-card-text><kbd>Delete</kbd> - 맵에서 선택한 시설물을 삭제한다</v-card-text>
                <v-card-text><kbd>ctrl + i</kbd> - 시작부터 끝 지점을 보간한다</v-card-text>

                <v-card-subtitle>Cloud 단축키</v-card-subtitle>
                <v-card-text><kbd>ctrl + f</kbd> - 현재 선택한 포인트를 포커싱한다</v-card-text>
                <v-card-text><kbd>ctrl + shift + f</kbd> - 현재 마우스 포인트를 포커싱한다</v-card-text>
                
                <v-card-subtitle>Map 단축키</v-card-subtitle>
                <v-card-text><kbd>shift + drag</kbd> - 드래그된 부분을 줌한다</v-card-text>

                <v-card-subtitle>이동 단축키 </v-card-subtitle>
                <v-card-text><kbd>Space</kbd> - 현재 마크를 포커싱한다 </v-card-text>
                <v-card-text><kbd>ctrl + &lt;</kbd> - 이전 마크로 이동한다 </v-card-text>
                <v-card-text><kbd>ctrl + &gt;</kbd> - 다음 마크로 이동한다 </v-card-text>

                <v-card-subtitle>UI 단축키 </v-card-subtitle>
                <v-card-text><kbd>ctrl + m</kbd> - 지도 뷰를 토글한다</v-card-text>
                <v-card-text><kbd>ctrl + 1</kbd> - Map View로 이동한다</v-card-text>
                <v-card-text><kbd>ctrl + 2</kbd> - Image View로 이동한다</v-card-text>
                <v-card-text><kbd>ctrl + 3</kbd> - Cloud View로 이동한다 </v-card-text>
              </v-expansion-panel-content>
            </v-expansion-panel>

          <!-- 작업 툴 구조 -->
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-card-title style="font-weight: bold">작업 툴 구조</v-card-title>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-divider />
                <v-card-subtitle>메인 뷰</v-card-subtitle>
                <v-card-text><kbd>지도</kbd> - 탑뷰를 볼 수 있다</v-card-text>
                <v-card-text><kbd>영상이미지</kbd> - 해당 마크에서 촬영한 이미지</v-card-text>
                <v-card-text><kbd>클라우드</kbd> - 3D View</v-card-text>

                <v-card-subtitle>서브 뷰</v-card-subtitle>
                <v-card-text><kbd>상단 바</kbd> - 작업할 대상을 정한다</v-card-text>
                <v-card-text><kbd>도구</kbd> - 좌측에 있으며 어떤 시설물을 도화할 지 정한다</v-card-text>
                <v-card-text><kbd>컨트롤 바</kbd> - 우측에 있으며 도화할 대상을 선택하거나 필터링한다</v-card-text>
              </v-expansion-panel-content>
            </v-expansion-panel>

          <!-- 도화 방법 -->
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-card-title style="font-weight: bold">도화 방법</v-card-title>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-divider />

                <v-card-subtitle>시설물 추가</v-card-subtitle>
                <v-card-text><kbd>지원 레이어</kbd> - B1, C1, D1, D2</v-card-text>
                <v-card-text><kbd>지도</kbd> - 현재 미지원</v-card-text>
                <v-card-text><kbd>영상이미지</kbd> - 뎁스가 있는 부분 클릭</v-card-text>
                <v-card-text><kbd>클라우드</kbd> - 클라우드가 있는 부분 더블클릭</v-card-text>

                <v-card-subtitle>시설물 선택</v-card-subtitle>
                <v-card-text><kbd>지원 레이어</kbd> - 모든 레이어</v-card-text>
                <v-card-text><kbd>지도</kbd> - 시설물 포인트 클릭</v-card-text>
                <v-card-text><kbd>영상이미지</kbd> - 시설물 포인트 근처 클릭</v-card-text>
                <v-card-text><kbd>클라우드</kbd> - 시설물 포인트 근처 더블클릭</v-card-text>

                <v-card-subtitle>시설물 수정</v-card-subtitle>
                <v-card-text><kbd>지원 레이어</kbd> - 모든 레이어</v-card-text>
                <v-card-text><kbd>시설물 연결 완료</kbd> - 다른 시설물과 연결하는 속성을 모두 완료하면 체크</v-card-text>
                <v-card-text><kbd>속성값 입력 완료</kbd> - 연결을 제외한 속성값 입력이 완료되면 체크</v-card-text>
                <v-card-text><kbd>위치보정 완료</kbd> - 위치보정 완료 후 체크</v-card-text>
                <v-card-text><kbd>추가 데이터 필요</kbd> - 값을 입력할 수 없어 추가데이터가 필요할때 코멘트를 남기고 체크</v-card-text>

                <v-card-subtitle>마크 이동</v-card-subtitle>
                <v-card-text><kbd>지도</kbd> - 이동할 마크를 클릭</v-card-text>
                <v-card-text><kbd>영상이미지</kbd> - 현재 미지원</v-card-text>
                <v-card-text><kbd>클라우드</kbd> - 이동할 마크를 더블클릭</v-card-text>
              </v-expansion-panel-content>
            </v-expansion-panel>

          <!-- 작업 레이어 -->
            <v-expansion-panel>
              <v-expansion-panel-header>
          <v-card-title style="font-weight: bold">작업 레이어</v-card-title>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
          <v-divider />
          <v-card-subtitle>시설물</v-card-subtitle>
          <v-card-text><kbd style="background: #990000">붉은색</kbd> - 선택한 포인트</v-card-text>
          <v-card-text><kbd style="background: #f07a7a">주황색</kbd> - 현재 선택 및 연관 시설물</v-card-text>
          <v-card-text><kbd style="background: #9911ff">보라색</kbd> - 현재 보이는 시설물들</v-card-text>
          <v-card-text><kbd style="background: #118080">초록색</kbd> - 참고 시설물</v-card-text>

          <v-card-subtitle>마크</v-card-subtitle>
          <v-card-text><kbd style="background: #18f">파란색</kbd> - 현재 마크</v-card-text>
          <v-card-text><kbd style="background: #22dd88">초록색</kbd> - 현재 스냅 마크들</v-card-text>
          <v-card-text><kbd style="background: #cc0">노란색</kbd> - 이동 가능 마크들</v-card-text>
          <v-card-text><kbd style="background: #e19">분홍색</kbd> - 총 마크들</v-card-text>
              </v-expansion-panel-content>
            </v-expansion-panel>

          <!-- 오류 대처 -->
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-card-title style="font-weight: bold">오류 대처</v-card-title></v-expansion-panel-header>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
          <v-divider />
          <v-card-text><kbd>오류 발생</kbd> - 캡쳐 후 새로고침하고 Telegram 에 업로드</v-card-text>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <!-- 참고자료 -->
            <v-expansion-panel>
              <v-expansion-panel-header>
          <v-card-title style="font-weight: bold">참고자료</v-card-title>
          </v-expansion-panel-header>
              </v-expansion-panel-header>
              <v-expansion-panel-content>

          <v-divider />
          <v-card-text><kbd>일람표</kbd></v-card-text>
          <v-img src="/example/total.jpg" />
          <v-card-text><kbd>B1</kbd> - 신호등</v-card-text>
          <v-img src="/example/B1_SAFETYSIGN_1.png" />
          <v-img src="/example/B1_SAFETYSIGN_2.png" />
          <v-img src="/example/B1_SAFETYSIGN_3.png" />
          <v-card-text><kbd>C1</kbd> - 표지판</v-card-text>
          <v-img src="/example/C1_TRAFFICLIGHT_1.png" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>


          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$router.push('/draw')">
              Go to Draw
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'help',
  middleware: 'authentication',
  layout: 'before'
}
</script>
