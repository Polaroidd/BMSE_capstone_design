#!/usr/bin/env python3
import json
import sys
import random
rule_1 = int(sys.argv[2]) #position1 - Aor U, generally 3
rule_2 = int(sys.argv[3]) #position 1 to 7 AU rich, generally 1
rule_3 = int(sys.argv[4]) #postion 19 G or C generally 2
rule_4 = int(sys.argv[5]) #GC contents penalty, generally per -2 over than 9
rule_5 = sys.argv[6] #binary, rules
#rule_6 = int(sys.argv[7]) #penalty to off-target
seq_len = int(sys.argv[7]) #len of siRNA, default 21

def transcription(DNA):
  result = ''
  for a in DNA:
    if a == 'T':
      result += 'U'
    else:
      result += a
  
  return DNA


def calculate_ui_tei_score(sequence):
    score = 0
    seq_17 = sequence[0:7]
    rule_2_score = 0
    gc_num = 0
    rule = ""

    for i in range(len(sequence)): #measure rule_2, rule_3
      if i>=0 and i<7:
        if sequence[i] == 'A' or sequence[i] == 'T':
          rule_2_score += rule_2
      if sequence[i] == 'G' or sequence[i] == 'C':
        gc_num += 1



    if sequence[0] == 'A' or sequence[0] == 'T':
        score += rule_1
        rule+="1"
    else:
        rule+="0"

    if rule_2_score < 4:
      rule+="0"
    else:
      rule+="1"
     
    score += rule_2_score*rule_2
    

    if sequence[19] == 'G' or sequence[19] == 'C':
        score += rule_3
        rule+="1"
    else:
        rule +="0"
     
    if gc_num > 9:
      rule+="1"
      score += rule_4*(gc_num-9)
    else:
      rule+="0"
    for i in range(len(rule)):
      if rule[i] == "1" or rule[i] == rule_5[i]:
        continue
      else:
        return -1,"xxxx"


    return score, rule


def find_siRNA_candidates(reference_sequence):
    can = []
    candidates = {}
    for i in range(len(reference_sequence) - seq_len):
        sequence = reference_sequence[i:i+seq_len]
        score,rule = calculate_ui_tei_score(sequence)
        idx = str(i)+" - "+str(i+seq_len-1)
        if score > 0 and rule!="xxxx": #pass criteria or good gc content
            if sequence in can:
              candidates[sequence][2] = candidates[sequence][2] + "\n"+idx
            else:
              can.append(sequence)
              candidates[sequence] = [score,rule,idx]

    return can, candidates


def converter(seq):
  result = ""
  D = {"A":"T","G":"C","T":"A","C":"G"}
  for a in seq:
    if a.upper() not in ["A","T","G","C","U"]:
      return "Wrong Sequence"
    if a.upper() == "U":
      result += "A"
    else:
      result+=D[a.upper()]
  return result

bases = ["A","T","G","C"]

#guid는 transcription(DNA).reverse(), passenger은 21nt + 2overhang의 transcription([2:])
if __name__ == "__main__":
  reference_sequence = sys.argv[1].rstrip()
  cv = converter(reference_sequence)
  if cv == "Wrong Sequence":
    sys.exit("Wrong Sequence")
  k,v = find_siRNA_candidates(cv)
  #key : seq, value : score, rule, idx
  sorted_list = sorted(v.items(), key=lambda x:x[1][0], reverse = True)
  sorted_list = sorted_list[:20]
  result_list = []
  s_lst = []
  for lst in sorted_list:
    siseq = lst[0]
    pos = lst[1][2]
    point = lst[1][0]
    t_rule = lst[1][1]
    poses = pos.split(' - ')
    for i in range(len(poses)):
      poses[i] = int(poses[i])

    target_seq = reference_sequence[poses[0]:poses[1]+3]
    #21nt target + 2 overhang
    guide_seq = transcription(siseq)[::-1]
    passenger_seq = transcription(target_seq[3:])
    target_pos = str(poses[0]) + ' - ' + str(poses[1]+2)
    t_lst = [target_pos,target_seq,guide_seq+'\n'+passenger_seq,t_rule,str(point)]
    s_lst.append(t_lst)
  # print(s_lst)
  # json_data = json.dumps(sorted_list, indent = 4)

  print(json.dumps(s_lst))

